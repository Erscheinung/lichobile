import utils from '../../utils';
import i18n from '../../i18n';
import { util } from 'chessground';
import settings from '../../settings';
import formWidgets from '../widget/form';
import popupWidget from '../widget/popup';
import backbutton from '../../backbutton';
import helper from '../helper';

function renderEnded(ctrl) {
  var sit = ctrl.root.replay.situation();
  var result, status;
  if (sit && sit.finished) {
    if (sit.checkmate) {
      result = sit.turnColor === 'white' ? '0-1' : '1-0';
      status = i18n('checkmate') + '. ' + i18n(sit.color === 'white' ? 'blackIsVictorious' : 'whiteIsVictorious') + '.';
    } else if (sit.stalemate || sit.draw || sit.threefold) {
      result = '½-½';
      if (sit.stalemate) status = i18n('stalemate');
      else status = i18n('draw');
    }
    return m('div.result', [result, m('br'), m('br'), m('div.status', status)]);
  }
}

function renderAlways(ctrl) {
  var d = ctrl.root.data;
  return [
    m('button[data-icon=U]', {
      config: helper.ontouch(utils.f(ctrl.root.initAs, util.opposite(d.player.color)))
    }, i18n('createAGame')),
    m('button.fa', {
      className: (window.cordova.platformId === 'android') ? 'fa-share-alt' : 'fa-share',
      config: helper.ontouch(ctrl.sharePGN)
    }, i18n('sharePGN')),
    m('div.action', m('div.select_input',
      formWidgets.renderSelect('opponent', 'opponent', settings.ai.availableOpponents, settings.ai.opponent)
    ))
  ];
}

module.exports = {
  controller: function(root) {
    let isOpen = false;

    function open() {
      backbutton.stack.push(close);
      isOpen = true;
    }

    function close(fromBB) {
      if (fromBB !== 'backbutton' && isOpen) backbutton.stack.pop();
      isOpen = false;
    }

    return {
      open: open,
      close: close,
      isOpen: function() {
        return isOpen;
      },
      sharePGN: function() {
        window.plugins.socialsharing.share(root.replay.pgn());
      },
      root: root
    };
  },

  view: function(ctrl) {
    return popupWidget(
      'offline_actions',
      null, [
        renderEnded(ctrl),
        renderAlways(ctrl)
      ],
      ctrl.isOpen(),
      ctrl.close
    );
  }
};
