/**
 * Connector Layer Component
 * Renders SVG connectors between columns
 */

import { useLayoutStore } from '../../store/layoutStore';
import { useCanvasStore } from '../../store/canvasStore';
import './ConnectorLayer.css';

export const ConnectorLayer = () => {
  const { columns } = useLayoutStore();
  const { connectors, canvasWidth, canvasHeight, deleteConnector, selectedConnectorId, selectConnector } = useCanvasStore();

  const getColumnPosition = (columnId: string) => {
    const column = columns.find((c) => c.id === columnId);
    if (!column) return null;

    // Get column element from DOM
    const element = document.querySelector(`[data-column-id="${columnId}"]`) as HTMLElement;
    if (!element) return null;

    const rect = element.getBoundingClientRect();
    const container = element.closest('.main-container');
    const containerRect = container?.getBoundingClientRect();

    if (!containerRect) return null;

    return {
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top + rect.height / 2,
      width: rect.width,
      height: rect.height,
    };
  };

  const getAnchorPoint = (columnId: string, anchor: string) => {
    const pos = getColumnPosition(columnId);
    if (!pos) return null;

    const { x, y, width, height } = pos;

    switch (anchor) {
      case 'top':
        return { x, y: y - height / 2 };
      case 'bottom':
        return { x, y: y + height / 2 };
      case 'left':
        return { x: x - width / 2, y };
      case 'right':
        return { x: x + width / 2, y };
      case 'top-left':
        return { x: x - width / 2, y: y - height / 2 };
      case 'top-right':
        return { x: x + width / 2, y: y - height / 2 };
      case 'bottom-left':
        return { x: x - width / 2, y: y + height / 2 };
      case 'bottom-right':
        return { x: x + width / 2, y: y + height / 2 };
      default:
        return { x, y };
    }
  };

  const createBezierPath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const offset = Math.min(dist * 0.4, 200);

    const cp1x = from.x + offset;
    const cp1y = from.y;
    const cp2x = to.x - offset;
    const cp2y = to.y;

    return `M ${from.x} ${from.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${to.x} ${to.y}`;
  };

  const handleConnectorClick = (connectorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    selectConnector(connectorId);
  };

  const handleDelete = (connectorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteConnector(connectorId);
  };

  return (
    <svg
      className="connector-layer"
      width={canvasWidth}
      height={canvasHeight}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#333" />
        </marker>
      </defs>

      {connectors.map((connector) => {
        const from = getAnchorPoint(connector.fromColumnId, connector.fromAnchor);
        const to = getAnchorPoint(connector.toColumnId, connector.toAnchor);

        if (!from || !to) return null;

        const path = createBezierPath(from, to);
        const isSelected = connector.id === selectedConnectorId;

        return (
          <g key={connector.id} style={{ pointerEvents: 'all' }}>
            <path
              d={path}
              stroke={connector.color || '#333'}
              strokeWidth={connector.strokeWidth || 2}
              fill="none"
              markerEnd="url(#arrowhead)"
              className={`connector ${isSelected ? 'selected' : ''}`}
              onClick={(e) => handleConnectorClick(connector.id, e)}
              style={{ cursor: 'pointer' }}
            />
            {isSelected && (
              <g>
                {/* Delete button */}
                <circle
                  cx={(from.x + to.x) / 2}
                  cy={(from.y + to.y) / 2}
                  r="12"
                  fill="#f44336"
                  onClick={(e) => handleDelete(connector.id, e)}
                  style={{ cursor: 'pointer' }}
                />
                <text
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2 + 4}
                  fontSize="14"
                  fill="white"
                  textAnchor="middle"
                  style={{ pointerEvents: 'none' }}
                >
                  ×
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};
