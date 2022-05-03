import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { 
    setZIndex as setFilesZIndex
} from '../../redux/files/actions';

import { 
    setZIndex as setNotepadZIndex
} from '../../redux/notepad/actions';

const mapStateToProps = (state) => ({
    window: {
        files: state.files,
        notepad: state.notepad
    }
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetNotepadZIndex: (id, value) => dispatch(setNotepadZIndex(id, value)),
    dispatchSetFilesZIndex: (id, value) => dispatch(setFilesZIndex(id, value))
});

type ZIndexProps = {
    notepad?: any;
    files?: any;
    ws?: any;
    window: {
        notepad: any;
        files: any;
    }

    dispatchSetNotepadZIndex: (id, value) => void;
    dispatchSetFilesZIndex: (id, value) => void;
}

function withZIndex(WrappedComponent) {
    class ZIndex extends React.Component<ZIndexProps> {
        constructor(props) {
            super(props);

            this.getHighestZIndex = this.getHighestZIndex.bind(this);
            this.moveToTop = this.moveToTop.bind(this);
        }

        getHighestZIndex() {
            const { 
              notepad, 
              files 
            } = this.props.window;
        
            if (Math.max(
              ...notepad.windows.map((w) => w.zIndex), 
              ...files.windows.map((w) => w.zIndex)
            ) === -Infinity) {
              return 0;
            }
            return Math.max(
              ...notepad.windows.map((w) => w.zIndex), 
              ...files.windows.map((w) => w.zIndex)
            );
          }

        moveToTop(windowType: string, windowId: number) {
            const {
                dispatchSetNotepadZIndex,
                dispatchSetFilesZIndex
            } = this.props;
            switch (windowType) {
                case 'notepad':
                    dispatchSetNotepadZIndex(windowId, this.getHighestZIndex() + 1);
                    break;
                case 'files':
                    dispatchSetFilesZIndex(windowId, this.getHighestZIndex() + 1);
                    break;
                default:
                    console.log('Unknown window type', windowType);
                    break;
            }
        }

        render() {
            return (
                <WrappedComponent getHighestZIndex={this.getHighestZIndex} moveToTop={this.moveToTop} {...this.props} />
            )
        }
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(ZIndex);
}

export default withZIndex;