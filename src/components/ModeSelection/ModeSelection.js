import React, {Component} from "react";
import './ModeSelection.css'

class ModeSelection extends Component {
    constructor(props) {
        super(props);
        this.onClick = this.props.onClick; 
        
        this.state = {
            text: this.props.text || '',
            curMode: this.props.curMode || 0,
            modes: this.props.modes || []
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            curMode: nextProps.mode || prevState.curMode,
            modes: nextProps.modes || prevState.modes
        };
    }

    onClickHandler = (mode) => {
        this.onClick(mode)
        this.setState({
            curMode: mode
        })
    }
    render(){
        const {curMode, modes,text} = this.state;
        return(
            <div className="ModeMenu">
                <h4>{text}</h4>
                {
                    modes.map((mode) => {return (
                        <button onClick={() => this.onClickHandler(mode)} className={mode} disabled={curMode === mode} key={mode}>{mode}</button>
                    )})
                }

            </div>
        )
    }
}

export default ModeSelection;