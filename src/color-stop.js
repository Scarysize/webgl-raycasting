import {h, Component} from 'preact';

export default class UI extends Component {
  constructor(props) {
    super(props);
  }

  onChange(event) {
    const color = event.target.value;

    this.props.onChange(color, this.props.index);
  }

  render(props) {
    const style = {
      backgroundColor: props.color,
      transform: `translateX(${256 * props.offset - 5}px)`
    };
    return (
      <div style={style} className="color-stop">
        <input
          type="color"
          value={props.color}
          onChange={this.onChange.bind(this)}
        />
      </div>
    );
  }
}
