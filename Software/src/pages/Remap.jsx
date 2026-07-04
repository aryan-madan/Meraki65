import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { GAP, getKeyLabel, KEYCODE_GROUPS, LAYER_META, MATRIX_LAYOUT, TOTAL_COLUMNS, U } from '../lib/layout';

const BOARD_WIDTH = TOTAL_COLUMNS * U + (TOTAL_COLUMNS - 1) * GAP;

function SectionCard({ children, style = {} }) {
  return (
    <section
      style={{
        background: 'rgba(255, 255, 255, 0.82)',
        border: '1px solid rgba(15, 23, 42, 0.07)',
        borderRadius: 28,
        boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.75)',
        ...style,
      }}
    >
      {children}
    </section>
  );
}

function SegmentedControl({ items, value, onChange, compact = false }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        gap: 4,
        padding: 4,
        borderRadius: 999,
        background: 'rgba(15, 23, 42, 0.05)',
        border: '1px solid rgba(15, 23, 42, 0.06)',
        flexWrap: 'wrap',
      }}
    >
      {items.map((item) => {
        const active = item.value === value;

        return (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            disabled={item.disabled}
            style={{
              padding: compact ? '7px 12px' : '9px 14px',
              borderRadius: 999,
              background: active ? '#ffffff' : 'transparent',
              color: active ? '#111827' : item.disabled ? '#c0c6d0' : '#6b7280',
              fontSize: compact ? 12 : 13,
              fontWeight: 600,
              boxShadow: active ? '0 1px 3px rgba(15, 23, 42, 0.08)' : 'none',
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function CommandButton({ label, onClick, disabled = false, primary = false, subtle = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '11px 15px',
        borderRadius: 14,
        background: primary
          ? 'linear-gradient(180deg, #0a84ff 0%, #0066db 100%)'
          : subtle
            ? 'rgba(255, 69, 58, 0.08)'
            : '#ffffff',
        color: primary ? '#ffffff' : subtle ? '#d2473d' : '#1f2937',
        border: `1px solid ${primary ? 'transparent' : subtle ? 'rgba(255, 69, 58, 0.12)' : 'rgba(15, 23, 42, 0.08)'}`,
        boxShadow: primary ? '0 10px 24px rgba(10, 132, 255, 0.2)' : '0 10px 24px rgba(15, 23, 42, 0.05)',
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      {label}
    </button>
  );
}

function MetricTile({ label, value, valueColor = '#111827' }) {
  return (
    <div
      style={{
        padding: '15px 16px',
        borderRadius: 20,
        background: 'rgba(246, 247, 251, 0.92)',
        border: '1px solid rgba(15, 23, 42, 0.05)',
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 600, color: '#8a93a3', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </div>
      <div style={{ marginTop: 8, fontSize: 15, fontWeight: 600, color: valueColor }}>
        {value}
      </div>
    </div>
  );
}

function Keycap({ keyData, label, selected, pressed, onClick }) {
  const width = keyData.w * U + (keyData.w - 1) * GAP;

  let background = 'linear-gradient(180deg, #fefefe 0%, #edf1f5 100%)';
  let border = '1px solid rgba(15, 23, 42, 0.08)';
  let shadow = '0 14px 30px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.92)';
  let textColor = '#3d4857';

  if (pressed) {
    background = 'linear-gradient(180deg, #ddf7e5 0%, #c6efd2 100%)';
    border = '1px solid rgba(52, 199, 89, 0.24)';
    shadow = '0 16px 34px rgba(52, 199, 89, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.9)';
    textColor = '#1f6c3e';
  } else if (selected) {
    background = 'linear-gradient(180deg, #dff0ff 0%, #c8e4ff 100%)';
    border = '1px solid rgba(10, 132, 255, 0.2)';
    shadow = '0 16px 34px rgba(10, 132, 255, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.92)';
    textColor = '#0a5ec2';
  }

  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',
        left: keyData.x * (U + GAP),
        width,
        height: U,
        borderRadius: 16,
        padding: keyData.shifted ? '8px 10px 10px' : '10px 12px',
        background,
        border,
        boxShadow: shadow,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: keyData.shifted ? 'space-between' : 'center',
        alignItems: keyData.shifted ? 'flex-start' : 'center',
        textAlign: 'left',
        color: textColor,
      }}
    >
      {keyData.shifted ? (
        <span style={{ fontSize: 10, fontWeight: 500, color: selected || pressed ? textColor : '#a0a8b5', lineHeight: 1 }}>
          {keyData.shifted}
        </span>
      ) : null}
      <span style={{ fontSize: label.length > 6 ? 11 : 13, fontWeight: 600, lineHeight: 1.1 }}>
        {label}
      </span>
    </button>
  );
}

function KeyboardPreview({ activeLayer, keymap, pressedKeys, selectedKey, onSelect }) {
  const pressedSet = useMemo(() => new Set(pressedKeys), [pressedKeys]);

  return (
    <div
      style={{
        position: 'relative',
        width: BOARD_WIDTH + 44,
        minWidth: BOARD_WIDTH + 44,
        padding: 22,
        borderRadius: 32,
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(244, 246, 250, 0.98) 100%)',
        border: '1px solid rgba(15, 23, 42, 0.08)',
        boxShadow: '0 30px 60px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.92)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 16,
          borderRadius: 26,
          border: '1px solid rgba(15, 23, 42, 0.04)',
          pointerEvents: 'none',
        }}
      />
      {MATRIX_LAYOUT.map((row, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          style={{
            position: 'relative',
            height: U,
            marginBottom: rowIndex === MATRIX_LAYOUT.length - 1 ? 0 : GAP,
          }}
        >
          {row.map((keyData) => {
            const [matrixRow, matrixCol] = keyData.matrix;
            const keycode = keymap?.[activeLayer]?.[matrixRow]?.[matrixCol] ?? 0;
            const isSelected = selectedKey?.matrix[0] === matrixRow && selectedKey?.matrix[1] === matrixCol;
            const isPressed = pressedSet.has(`${matrixRow}:${matrixCol}`);

            return (
              <Keycap
                key={`${matrixRow}:${matrixCol}`}
                keyData={keyData}
                label={getKeyLabel(keycode)}
                selected={isSelected}
                pressed={isPressed}
                onClick={() => onSelect(keyData)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function GroupButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 12px',
        borderRadius: 14,
        background: active ? '#eef5ff' : 'transparent',
        color: active ? '#0a5ec2' : '#6b7280',
        border: `1px solid ${active ? 'rgba(10, 132, 255, 0.12)' : 'transparent'}`,
        fontSize: 13,
        fontWeight: 600,
        textAlign: 'left',
      }}
    >
      {children}
    </button>
  );
}

function KeycodeButton({ label, keycode, active, disabled, onClick }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        minHeight: 72,
        padding: '12px 12px 13px',
        borderRadius: 16,
        background: active ? '#edf5ff' : '#f8f9fc',
        border: `1px solid ${active ? 'rgba(10, 132, 255, 0.16)' : 'rgba(15, 23, 42, 0.06)'}`,
        color: disabled ? '#c0c6d0' : active ? '#0a5ec2' : '#1f2937',
        textAlign: 'left',
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
      <div style={{ marginTop: 8, fontSize: 11, color: disabled ? '#d3d8e0' : '#9aa3b2' }}>
        0x{keycode.toString(16).toUpperCase().padStart(4, '0')}
      </div>
    </button>
  );
}

export default function RemapPage({ hid }) {
  const [activeLayer, setActiveLayer] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState(KEYCODE_GROUPS[0].name);
  const [selectedKey, setSelectedKey] = useState(null);
  const [status, setStatus] = useState('');
  const [isCompactLayout, setIsCompactLayout] = useState(false);

  const deferredPressedKeys = useDeferredValue(hid.pressedKeys);
  const availableLayers = LAYER_META.slice(0, hid.layerCount || 4);
  const currentGroup = KEYCODE_GROUPS.find((group) => group.name === selectedGroup) ?? KEYCODE_GROUPS[0];
  const selectedMatrix = selectedKey?.matrix ?? null;
  const selectedRow = selectedMatrix?.[0];
  const selectedCol = selectedMatrix?.[1];
  const selectedKeycode =
    selectedRow !== undefined && selectedCol !== undefined
      ? hid.keymap?.[activeLayer]?.[selectedRow]?.[selectedCol] ?? 0
      : null;
  const selectedLayerMeta = availableLayers.find((layer) => layer.id === activeLayer) ?? availableLayers[0];
  const baseLayerName = LAYER_META.find((layer) => layer.id === hid.baseLayer)?.name ?? 'Unknown';

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1280px)');
    const syncLayout = (event) => {
      setIsCompactLayout(event.matches);
    };

    syncLayout(mediaQuery);
    mediaQuery.addEventListener('change', syncLayout);

    return () => {
      mediaQuery.removeEventListener('change', syncLayout);
    };
  }, []);

  const saveStatus = async (task, nextMessage) => {
    setStatus('');

    try {
      await task();
      setStatus(nextMessage);
    } catch {
      // Errors are surfaced from the HID hook already.
    }
  };

  const onAssignKeycode = async (keycode) => {
    if (!selectedKey || !hid.connected) {
      return;
    }

    await saveStatus(
      () => hid.setKeycode(activeLayer, selectedKey.matrix[0], selectedKey.matrix[1], keycode),
      `${selectedKey.legend} updated to ${getKeyLabel(keycode)} on ${selectedLayerMeta?.name || 'this layer'}.`
    );
  };

  return (
    <div
      style={{
        maxWidth: 1680,
        margin: '0 auto',
        padding: '28px 28px 34px',
        display: 'grid',
        gridTemplateColumns: isCompactLayout ? 'minmax(0, 1fr)' : 'minmax(0, 1.6fr) 380px',
        gap: 24,
        minHeight: 'calc(100vh - 88px)',
      }}
    >
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <SectionCard style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ maxWidth: 620 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Keyboard Remapper</div>
              <h1 style={{ marginTop: 8, fontSize: 36, lineHeight: 1.05, fontWeight: 700, color: '#111827' }}>
                Beautifully simple control for Meraki.
              </h1>
              <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.65, color: '#6b7280' }}>
                Edit all four layers, switch between Mac and Windows mode, reset the dynamic keymap, and watch live key activity from firmware debug without leaving the same window.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <CommandButton
                label={hid.connected ? 'Disconnect Keyboard' : hid.isBusy ? 'Connecting…' : 'Connect Keyboard'}
                onClick={hid.connected ? hid.disconnect : hid.connect}
                disabled={hid.isBusy}
                primary
              />
              <CommandButton
                label="Refresh"
                onClick={() => saveStatus(() => hid.refreshKeymap(), 'Keyboard state refreshed.')}
                disabled={!hid.connected || hid.isBusy}
              />
            </div>
          </div>

          <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
            <MetricTile label="Device" value={hid.connected ? hid.deviceName : 'Not connected'} />
            <MetricTile label="Mode" value={hid.isMacMode ? 'Mac Profile' : 'Windows Profile'} valueColor={hid.isMacMode ? '#0a5ec2' : '#111827'} />
            <MetricTile label="Base Layer" value={baseLayerName} />
            <MetricTile label="Protocol" value={`v${hid.protocolVersion}`} />
          </div>

          {hid.error ? (
            <div
              style={{
                marginTop: 16,
                padding: '14px 16px',
                borderRadius: 18,
                background: '#fff5f4',
                border: '1px solid rgba(255, 69, 58, 0.12)',
                color: '#c24139',
                fontSize: 13,
                lineHeight: 1.55,
              }}
            >
              {hid.error}
            </div>
          ) : null}

          {status ? (
            <div
              style={{
                marginTop: 16,
                padding: '14px 16px',
                borderRadius: 18,
                background: '#f2faf4',
                border: '1px solid rgba(52, 199, 89, 0.14)',
                color: '#257548',
                fontSize: 13,
                lineHeight: 1.55,
              }}
            >
              {status}
            </div>
          ) : null}
        </SectionCard>

        <SectionCard style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#98a1af' }}>
                Layer
              </div>
              <SegmentedControl
                items={availableLayers.map((layer) => ({ label: layer.name, value: layer.id }))}
                value={activeLayer}
                onChange={setActiveLayer}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#98a1af' }}>
                Keyboard Mode
              </div>
              <SegmentedControl
                compact
                items={[
                  { label: 'Windows', value: false, disabled: !hid.connected || hid.isBusy },
                  { label: 'Mac', value: true, disabled: !hid.connected || hid.isBusy },
                ]}
                value={hid.isMacMode}
                onChange={(nextMode) => saveStatus(() => hid.setMode(nextMode), `Keyboard switched to ${nextMode ? 'Mac' : 'Windows'} mode.`)}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <CommandButton
                label={hid.debugEnabled ? 'Stop Debug' : 'Start Debug'}
                onClick={() => saveStatus(() => hid.setDebug(!hid.debugEnabled), hid.debugEnabled ? 'Debug stream stopped.' : 'Debug stream enabled.')}
                disabled={!hid.connected || hid.isBusy}
              />
              <CommandButton
                label="Reset to Defaults"
                onClick={() => saveStatus(() => hid.resetKeymap(), 'Default keymap restored from firmware.')}
                disabled={!hid.connected || hid.isBusy}
                subtle
              />
            </div>
          </div>

          <div style={{ marginTop: 22, overflowX: 'auto', paddingBottom: 6 }}>
            <KeyboardPreview
              activeLayer={activeLayer}
              keymap={hid.keymap}
              pressedKeys={deferredPressedKeys}
              selectedKey={selectedKey}
              onSelect={setSelectedKey}
            />
          </div>

          <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
            <MetricTile
              label="Selected Key"
              value={selectedKey ? `${selectedKey.legend}  •  row ${selectedKey.matrix[0]} col ${selectedKey.matrix[1]}` : 'Choose a key on the keyboard'}
            />
            <MetricTile
              label="Current Binding"
              value={selectedKeycode !== null ? getKeyLabel(selectedKeycode) : 'No key selected'}
              valueColor={selectedKeycode !== null ? '#0a5ec2' : '#111827'}
            />
            <MetricTile
              label="Pressed Keys"
              value={deferredPressedKeys.length ? deferredPressedKeys.join(', ') : hid.debugEnabled ? 'Waiting for input…' : 'Debug stream is off'}
              valueColor={deferredPressedKeys.length ? '#257548' : '#111827'}
            />
          </div>
        </SectionCard>
      </div>

      <SectionCard
        style={{
          padding: 22,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          minWidth: 0,
          minHeight: isCompactLayout ? 'auto' : 0,
        }}
      >
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#98a1af' }}>
            Inspector
          </div>
          <h2 style={{ marginTop: 8, fontSize: 28, fontWeight: 700, color: '#111827' }}>
            {selectedKey ? selectedKey.legend : 'Select a key'}
          </h2>
          <p style={{ marginTop: 10, fontSize: 14, lineHeight: 1.65, color: '#6b7280' }}>
            {selectedKey
              ? `Assign a new keycode for row ${selectedKey.matrix[0]}, column ${selectedKey.matrix[1]} on ${selectedLayerMeta?.name || 'this layer'}.`
              : 'Choose a key from the keyboard preview to inspect its matrix location and remap it.'}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#98a1af' }}>
            Categories
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
            {KEYCODE_GROUPS.map((group) => (
              <GroupButton key={group.name} active={selectedGroup === group.name} onClick={() => setSelectedGroup(group.name)}>
                {group.name}
              </GroupButton>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', paddingRight: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            {currentGroup.options.map(([label, keycode]) => (
              <KeycodeButton
                key={`${currentGroup.name}-${keycode}`}
                label={label}
                keycode={keycode}
                active={selectedKeycode === keycode}
                disabled={!selectedKey || !hid.connected || hid.isBusy}
                onClick={() => onAssignKeycode(keycode)}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            padding: 16,
            borderRadius: 20,
            background: '#f7f8fb',
            border: '1px solid rgba(15, 23, 42, 0.06)',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>Debug</div>
          <p style={{ marginTop: 8, fontSize: 13, lineHeight: 1.65, color: '#6b7280' }}>
            When debug is enabled, the keyboard preview highlights pressed matrix positions in green while QMK console continues to print each resolved keycode.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
