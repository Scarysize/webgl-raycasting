import {h, Component} from 'preact';

import ColorStop from './color-stop';

const initialState = [
  {color: '#ffffff', offset: 0.0},
  {color: '#ff9900', offset: 0.5},
  {color: '#ff0000', offset: 1.0}
];

export default class UI extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;
  }

  onColorChange(color, index) {
    const newState = this.state.map((stop, stopIndex) => {
      if (stopIndex === index) {
        stop.color = color;
      }

      return stop;
    });

    this.setState(newState, this.drawCanvas.bind(this));
  }

  initCanvas(canvas) {
    if (this.canvas) {
      return;
    }

    this.canvas = canvas;
    this.drawCanvas();
  }

  drawCanvas() {
    const stops = this.state;
    const context = this.canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 255, 19);

    stops.forEach(stop => gradient.addColorStop(stop.offset, stop.color));
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 20);
  }

  componentDidUpdate() {
    this.props.onUpdate(this.canvas.getContext('2d'));
  }

  render() {
    return (
      <div>
        <canvas width={256} height={20} ref={this.initCanvas.bind(this)} />
        <div className="color-stops">
          {this.state.map(({offset, color}, index) => (
            <ColorStop
              offset={offset}
              color={color}
              onChange={this.onColorChange.bind(this)}
              index={index}
            />
          ))}
        </div>
      </div>
    );
  }
}
