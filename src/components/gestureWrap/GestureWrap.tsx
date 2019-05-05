import * as React from "react";
import styles from "./GestureWrap.module.scss";
import Hammer from "hammerjs";

export interface IGestureWrapProps {}

export interface IGestureWrapState {
  mapScale: { x: number; y: number };
  mapTranslate: { x: number; y: number };
}

export default class GestureWrap extends React.Component<IGestureWrapProps, IGestureWrapState> {
  // For panning
  private panStartCoords = { x: 0, y: 0 };
  private pinchStart = { x: 1, y: 1 };

  constructor(props: IGestureWrapProps) {
    super(props);

    this.state = {
      mapScale: { x: 1, y: 1 },
      mapTranslate: { x: 0, y: 0 }
    };
  }

  public render() {
    let { mapTranslate, mapScale } = this.state;

    let hammerTime: React.CSSProperties = {
      transform: `translate(${mapTranslate.x}px, ${mapTranslate.y}px) scale(${mapScale.x}, ${mapScale.y})`,
    };

    return (
      <div id="GestureWrap" className={styles.gestureWrap}>
        <div className={styles.hammerStyle} style={hammerTime}> {this.props.children} </div>
      </div>
    );
  }

  /**
   * Lifecycle react method. This method is triggered when the react component is correctly loaded into the dom.
   */
  public componentDidMount() {
    // ADD HAMMER
    var container: any = document.getElementById("GestureWrap");
    var mc = new Hammer.Manager(container);
    mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
    mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith(mc.get("pan"));
    mc.on("panstart panmove", this.throttled(this.onPan, 8));
    mc.on("pinchstart pinchmove", this.throttled(this.onPinch, 8));
  }

  /**
   * Touch gestures
   */

  private onPan = (e: HammerInput) => {
    if (e.type === "panstart") {
      this.panStartCoords = {
        x: this.state.mapTranslate.x,
        y: this.state.mapTranslate.y
      };
    }

    this.setState({
      mapTranslate: {
        x: this.panStartCoords.x + e.deltaX,
        y: this.panStartCoords.y + e.deltaY
      }
    });
  };

  private onPinch = (e: HammerInput) => {
    if (e.type === "pinchstart") {
      this.pinchStart = { x: this.state.mapScale.x, y: this.state.mapScale.y };
    }

    this.setState({
      mapScale: {
        x: e.scale * this.pinchStart.x,
        y: e.scale * this.pinchStart.y
      }
    });
  };

  /**
   * Function for throtteling the eventhandlers for gestures on the map
   * Inspired from https://codeburst.io/throttling-and-debouncing-in-javascript-646d076d0a44
   * and https://gist.github.com/Almenon/f2043143e6e7b4610817cb48c962d4d5
   * @param delay Milisencods delay between handler calls. 60 Hz gives a 16 ms delay
   * @param fn Handler
   */
  private throttled(fn: Function, delay: number) {
    let canCall = true;

    return function(...args: any) {
      if (canCall) {
        canCall = false;
        fn(...args);
        setTimeout(function() {
          canCall = true;
        }, delay);
      }
    };
  }
}