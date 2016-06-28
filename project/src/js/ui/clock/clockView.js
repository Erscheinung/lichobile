import h from '../helper';
import m from 'mithril';
import layout from '../layout';
import clockSettings from './clockSettings';
import { formatTimeinSecs } from '../../utils';
import sound from '../../sound';

export default function view(ctrl) {
  const body = clockBody.bind(undefined, ctrl);
  const clockSettingsOverlay = renderClockSettingsOverlay.bind(undefined, ctrl);

  return layout.clock(body, clockSettingsOverlay);
}

function renderClockSettingsOverlay(ctrl) {
  return [
    clockSettings.view(ctrl.clockSettingsCtrl)
  ];
}

function clockBody(ctrl) {
  const clock = ctrl.clockObj();
  if (!clock) return null;
  const topActive = clock.activeSide() === 'top';
  const bottomActive = clock.activeSide() === 'bottom';
  const topFlagged = clock.flagged() === 'top';
  const bottomFlagged = clock.flagged() === 'bottom';

  return (
    <div className="clockContainer">
      <div key="topClockTapArea" className={'clockTapArea top' + (topActive ? ' running' : '') + (topFlagged ? ' flagged' : '')} config={h.ontouch(() => onClockTap(ctrl, 'top'))}>
        { clock.topRemainingMoves ?
        <div className="clockTapAreaContent">
          <span>Moves Remaining: {clock.topRemainingMoves ? clock.topRemainingMoves() : ''}</span>
        </div> : null
        }
        <div className="clockTapAreaContent">
          <span className={'clockTime' + (topFlagged ? ' flagged' : '')}>
            { topFlagged ? 'b' : formatTimeinSecs(clock.topTime()) }
          </span>
        </div>
        { clock.topRemainingMoves ?
        <div className="clockTapAreaContent"/> : null
        }
      </div>
      <div className="clockControls">
        <span className={'fa' + (clock.isRunning() ? ' fa-pause' : ' fa-play')} config={h.ontouch(() => ctrl.startStop())} />
        <span className="fa fa-refresh" config={h.ontouch(() => ctrl.reload())} />
        <span className="fa fa-cog" config={h.ontouch(() => ctrl.clockSettingsCtrl.open())} />
        <span className="fa fa-home" config={h.ontouch(() => m.route('/'))} />
      </div>
      <div key="bottomClockTapArea" className={'clockTapArea' + (bottomActive ? ' running' : '')  + (bottomFlagged ? ' flagged' : '')} config={h.ontouch(() => onClockTap(ctrl, 'bottom'))}>
        { clock.bottomRemainingMoves ?
        <div className="clockTapAreaContent"/> : null
        }
        <div className="clockTapAreaContent">
          <span className={'clockTime' + (bottomFlagged ? ' flagged' : '')}>
            { bottomFlagged ? 'b' : formatTimeinSecs(clock.bottomTime()) }
          </span>
        </div>
        { clock.bottomRemainingMoves ?
        <div className="clockTapAreaContent">
          <span>Moves Remaining: {clock.bottomRemainingMoves ? clock.bottomRemainingMoves() : ''}</span>
        </div> : null
        }
      </div>
    </div>
  );
}

function onClockTap(ctrl, side) {
  if (((ctrl.clockObj().activeSide() !== 'top') && (side === 'bottom')) || ((ctrl.clockObj().activeSide() !== 'bottom') && (side === 'top'))) {
    sound.clock();
    ctrl.clockTap(side);
  }
}