import React from "react";

interface GamepadProps {
  index: number;
  gamepad: Gamepad | null;
}

declare global {
  interface Gamepad {
    vibrationActuator: any;
  }
}

class AxisItem extends React.Component<any> {
  render() {
    return (
      <li className={this.props.className} style={this.props.style}>
        <label>{this.props.label}</label>
        <span className="value">{this.props.value}</span>
      </li>
    )
  }
}


class HitboxButton extends AxisItem{
  
  render(){
    return(
      
        <div className={this.props.className} id={this.props.id} style={this.props.style}>
     <svg className="button-svg" height="100%" width="100%" viewBox="0 0 26 26">
                <circle className="secondary" cx="12" cy="12" r="12px" />
                <circle className="primary" cx="12" cy="12" r="10px" />
            </svg>     
        
      
    </div>  

    
    )}
}

export default class GamepadItem extends React.Component<GamepadProps, any> {
  axisStyle(n: number) {
    return {
      opacity: Math.abs(n) + 0.3
    }
  }

  buttonStyle(id: GamepadButton) {
    var val = this.buttonValue(id);
    return {
      opacity: Math.abs(val) + 0.3
    }
  }

  buttonValue(b: GamepadButton) {
    return (typeof (b) == 'number') ? b : b.value;
  }

  buttonPressed(b: GamepadButton) {
    return (typeof (b) == 'number') ? b > 0.1 : b.pressed
  }

  mappingString(mapping: GamepadMappingType) {
    return mapping || 'n/a';
  }

  formatFloat(n: number, places: number) {
    var m = Math.pow(10, places);
    return "" + parseFloat("" + Math.round(n * m) / m).toFixed(places);
  }

  testVibration() {
    if (this.props.gamepad && this.props.gamepad.vibrationActuator) {
      this.props.gamepad.vibrationActuator.playEffect("dual-rumble", {
        startDelat: 0,
        duration: 1000,
        weakMagnitude: 1.0,
        strongMagnitude: 1.0
      });
    }
  }

  render() {
    var gamepad = this.props.gamepad;
    if (gamepad && gamepad as Gamepad) {
      return (
        <div className="gamepad">
          <h2 className="active">
            <span className="icon">{this.props.index + 1} </span>
            <span>{gamepad.id}</span>
          </h2>

          <ul className="info">
            <AxisItem label="INDEX" value={gamepad.index} />
            <AxisItem className="med" label="CONNECTED" value={gamepad.connected ? "Yes" : "No"} />
            <AxisItem className="med" label="MAPPING" value={this.mappingString(gamepad.mapping)} />
            <AxisItem className="large" label="TIMESTAMP" value={this.formatFloat(gamepad.timestamp, 5)} />
          </ul>

          <ul className="axes">
            {gamepad.axes.map((axis, i) =>
              (<AxisItem key={i} label="INDEX" value={this.formatFloat(axis, 5)} style={this.axisStyle(axis)} />
               )
            )}
          </ul>

          <ul className="buttons">
            {gamepad.buttons.map((button, i) =>
              <AxisItem key={i} label={"B" + i} value={this.formatFloat(this.buttonValue(button), 2)} style={this.buttonStyle(button)} />
              
            )}
          </ul>
          <ul className="buttons">
            {gamepad.buttons.map((button, i) =>
              <AxisItem key={i} label={"B" + i} value={this.formatFloat(this.buttonValue(button), 2)} style={this.buttonStyle(button)} />
              
            )}
          </ul>
          <section className="hbuttons">
          {gamepad.buttons.map((button, i) =>{
              let className = "white button-container"
              if(i>11){
                className = "red button-container"
              }
              if((i>=8 && i<=11) || i>15){
                return (null)
              }else{
                return <HitboxButton key={i} label={"B" + i} id = {"b-"+i} className={className} style={this.buttonStyle(button)} />

              }
              
            } )}

          </section>
        </div >
      )
    } else {
      return (
        <div className="gamepad">
          <h2 className="inactive">
            <span className="icon">{this.props.index + 1} </span>
            <span>n/a</span>
          </h2>
        </div>
      )
    }
  }
}