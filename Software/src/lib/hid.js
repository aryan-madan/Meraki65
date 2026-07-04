import { startTransition, useEffect, useRef, useState } from 'react';

const VID = 0xfeed;
const PID = 0x6537;
const USAGE_PAGE = 0xff60;
const USAGE = 0x61;
const REPORT_ID = 0x00;
const PACKET_SIZE = 32;
const INPUT_TIMEOUT_MS = 1200;

const COMMAND = {
  GET_INFO: 0x01,
  GET_KEYCODE: 0x02,
  SET_KEYCODE: 0x03,
  GET_MODE: 0x04,
  SET_MODE: 0x05,
  RESET_KEYMAP: 0x06,
  SET_DEBUG: 0x07,
  MATRIX_EVENT: 0x20,
};

const EMPTY_KEYS = [];

function createPacket(bytes = []) {
  const packet = new Uint8Array(PACKET_SIZE);
  packet.set(bytes.slice(0, PACKET_SIZE));
  return packet;
}

function matrixBitIndex(row, col, cols) {
  return row * cols + col;
}

function parseMatrixPacket(packet, rows, cols) {
  const pressed = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const bitIndex = matrixBitIndex(row, col, cols);
      const byteIndex = 3 + Math.floor(bitIndex / 8);
      const bitMask = 1 << (bitIndex % 8);

      if (packet[byteIndex] & bitMask) {
        pressed.push(`${row}:${col}`);
      }
    }
  }

  return pressed;
}

export function useWebHID() {
  const [device, setDevice] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [deviceName, setDeviceName] = useState('aryanworks Meraki');
  const [matrixSize, setMatrixSize] = useState({ rows: 5, cols: 15 });
  const [layerCount, setLayerCount] = useState(4);
  const [baseLayer, setBaseLayer] = useState(0);
  const [isMacMode, setIsMacMode] = useState(false);
  const [debugEnabled, setDebugEnabled] = useState(false);
  const [protocolVersion, setProtocolVersion] = useState(1);
  const [keymap, setKeymap] = useState({});
  const [pressedKeys, setPressedKeys] = useState(EMPTY_KEYS);

  const deviceRef = useRef(null);
  const pendingRef = useRef([]);
  const matrixSizeRef = useRef({ rows: 5, cols: 15 });
  const layerCountRef = useRef(4);

  const safeSetError = (message) => {
    startTransition(() => setError(message ?? ''));
  };

  const clearPending = (reason) => {
    pendingRef.current.forEach(({ timer, reject }) => {
      window.clearTimeout(timer);
      reject(reason instanceof Error ? reason : new Error(String(reason)));
    });
    pendingRef.current = [];
  };

  const handleInputReport = (event) => {
    const packet = new Uint8Array(event.data.buffer);

    if (packet[0] === COMMAND.MATRIX_EVENT) {
      startTransition(() => {
        setIsMacMode(Boolean(packet[1]));
        setBaseLayer(packet[1] ? 2 : 0);
        setPressedKeys(parseMatrixPacket(packet, matrixSizeRef.current.rows, matrixSizeRef.current.cols));
      });
      return;
    }

    const pending = pendingRef.current.shift();
    if (!pending) {
      return;
    }

    window.clearTimeout(pending.timer);
    pending.resolve(packet);
  };

  const bindDevice = async (nextDevice) => {
    if (!nextDevice.opened) {
      await nextDevice.open();
    }

    nextDevice.removeEventListener('inputreport', handleInputReport);
    nextDevice.addEventListener('inputreport', handleInputReport);
    deviceRef.current = nextDevice;

    startTransition(() => {
      setDevice(nextDevice);
      setConnected(true);
      setDeviceName(nextDevice.productName || 'aryanworks Meraki');
    });
  };

  const sendCommand = async (bytes) => {
    const activeDevice = deviceRef.current;
    if (!activeDevice?.opened) {
      throw new Error('Keyboard is not connected.');
    }

    const packet = createPacket(bytes);
    const responsePromise = new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => {
        pendingRef.current = pendingRef.current.filter((entry) => entry.reject !== reject);
        reject(new Error('Keyboard did not respond in time.'));
      }, INPUT_TIMEOUT_MS);

      pendingRef.current.push({ resolve, reject, timer });
    });

    await activeDevice.sendReport(REPORT_ID, packet);
    return responsePromise;
  };

  const refreshKeymap = async (rowsArg = matrixSizeRef.current.rows, colsArg = matrixSizeRef.current.cols, layersArg = layerCountRef.current) => {
    const nextKeymap = {};

    for (let layer = 0; layer < layersArg; layer += 1) {
      nextKeymap[layer] = {};
      for (let row = 0; row < rowsArg; row += 1) {
        nextKeymap[layer][row] = {};
        for (let col = 0; col < colsArg; col += 1) {
          const packet = await sendCommand([COMMAND.GET_KEYCODE, layer, row, col]);
          nextKeymap[layer][row][col] = packet[4] | (packet[5] << 8);
        }
      }
    }

    startTransition(() => {
      setKeymap(nextKeymap);
    });

    return nextKeymap;
  };

  const syncDevice = async () => {
    const info = await sendCommand([COMMAND.GET_INFO]);
    const rows = info[1] || 5;
    const cols = info[2] || 15;
    const layers = info[3] || 4;
    const base = info[4] || 0;
    const macMode = Boolean(info[5]);
    const protocol = info[6] || 1;

    matrixSizeRef.current = { rows, cols };
    layerCountRef.current = layers;

    startTransition(() => {
      setMatrixSize({ rows, cols });
      setLayerCount(layers);
      setBaseLayer(base);
      setIsMacMode(macMode);
      setProtocolVersion(protocol);
      setPressedKeys(EMPTY_KEYS);
    });

    await refreshKeymap(rows, cols, layers);
  };

  const disconnect = async () => {
    const activeDevice = deviceRef.current;
    if (!activeDevice) {
      return;
    }

    clearPending(new Error('Keyboard disconnected.'));

    try {
      activeDevice.removeEventListener('inputreport', handleInputReport);
      if (activeDevice.opened) {
        await activeDevice.close();
      }
    } finally {
      deviceRef.current = null;
      startTransition(() => {
        setDevice(null);
        setConnected(false);
        setIsBusy(false);
        setDebugEnabled(false);
        setPressedKeys(EMPTY_KEYS);
      });
    }
  };

  const connect = async () => {
    if (!('hid' in navigator)) {
      safeSetError('This browser does not support WebHID. Use Chrome or Edge on desktop.');
      return false;
    }

    setIsBusy(true);
    safeSetError('');

    try {
      const [selectedDevice] = await navigator.hid.requestDevice({
        filters: [{ vendorId: VID, productId: PID, usagePage: USAGE_PAGE, usage: USAGE }],
      });

      if (!selectedDevice) {
        setIsBusy(false);
        return false;
      }

      await bindDevice(selectedDevice);
      await syncDevice();
      return true;
    } catch (connectError) {
      safeSetError(connectError.message || 'Unable to connect to the keyboard.');
      return false;
    } finally {
      startTransition(() => setIsBusy(false));
    }
  };

  const setMode = async (nextIsMacMode) => {
    setIsBusy(true);
    safeSetError('');

    try {
      const packet = await sendCommand([COMMAND.SET_MODE, nextIsMacMode ? 1 : 0]);
      startTransition(() => {
        setIsMacMode(Boolean(packet[1]));
        setBaseLayer(packet[2] || 0);
      });
    } catch (modeError) {
      safeSetError(modeError.message || 'Unable to change keyboard mode.');
      throw modeError;
    } finally {
      startTransition(() => setIsBusy(false));
    }
  };

  const setKeycode = async (layer, row, col, keycode) => {
    setIsBusy(true);
    safeSetError('');

    try {
      await sendCommand([COMMAND.SET_KEYCODE, layer, row, col, keycode & 0xff, (keycode >> 8) & 0xff]);
      startTransition(() => {
        setKeymap((current) => ({
          ...current,
          [layer]: {
            ...(current[layer] ?? {}),
            [row]: {
              ...(current[layer]?.[row] ?? {}),
              [col]: keycode,
            },
          },
        }));
      });
    } catch (setErrorMessage) {
      safeSetError(setErrorMessage.message || 'Unable to update keycode.');
      throw setErrorMessage;
    } finally {
      startTransition(() => setIsBusy(false));
    }
  };

  const resetKeymap = async () => {
    setIsBusy(true);
    safeSetError('');

    try {
      await sendCommand([COMMAND.RESET_KEYMAP]);
      await syncDevice();
    } catch (resetError) {
      safeSetError(resetError.message || 'Unable to reset the keyboard keymap.');
      throw resetError;
    } finally {
      startTransition(() => setIsBusy(false));
    }
  };

  const setDebug = async (enabled) => {
    setIsBusy(true);
    safeSetError('');

    try {
      const packet = await sendCommand([COMMAND.SET_DEBUG, enabled ? 1 : 0]);
      startTransition(() => {
        setDebugEnabled(Boolean(packet[1]));
        if (!packet[1]) {
          setPressedKeys(EMPTY_KEYS);
        }
      });
    } catch (debugError) {
      safeSetError(debugError.message || 'Unable to change debug mode.');
      throw debugError;
    } finally {
      startTransition(() => setIsBusy(false));
    }
  };

  useEffect(() => {
    if (!('hid' in navigator)) {
      return undefined;
    }

    const handleDisconnect = (event) => {
      if (event.device !== deviceRef.current) {
        return;
      }

      clearPending(new Error('Keyboard disconnected.'));
      deviceRef.current = null;
      startTransition(() => {
        setDevice(null);
        setConnected(false);
        setIsBusy(false);
        setDebugEnabled(false);
        setPressedKeys(EMPTY_KEYS);
        setError('Keyboard disconnected.');
      });
    };

    navigator.hid.addEventListener('disconnect', handleDisconnect);

    return () => {
      navigator.hid.removeEventListener('disconnect', handleDisconnect);
    };
  }, []);

  useEffect(() => () => {
    clearPending(new Error('Keyboard session closed.'));
  }, []);

  return {
    device,
    deviceName,
    connected,
    error,
    isBusy,
    matrixSize,
    layerCount,
    baseLayer,
    isMacMode,
    debugEnabled,
    protocolVersion,
    keymap,
    pressedKeys,
    connect,
    disconnect,
    refreshKeymap: () => syncDevice(),
    setMode,
    setKeycode,
    resetKeymap,
    setDebug,
  };
}
