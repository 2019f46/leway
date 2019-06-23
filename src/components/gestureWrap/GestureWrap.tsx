import * as React from "react";
import styles from "./GestureWrap.module.scss";
import Hammer from "hammerjs";

export interface IGestureWrapProps {}

export interface IGestureWrapState {
  /** Scale of the map, used for transforming the wrapper */
  mapScale: { x: number; y: number };
  /** Translate of the map, used for transforming the wrapper */
  mapTranslate: { x: number; y: number };
  panOffset: {x: number; y: number };
  zoomOffset: {x: number; y: number };
}

export default class GestureWrap extends React.Component<IGestureWrapProps, IGestureWrapState> {
  /** Coordinates for where the pan was started */
  private panStartCoords = { x: 0, y: 0 };
  /** Scale for when the pinch was started */
  private pinchStart = { x: 0.9, y: 0.9 };
  private translation = {x: 0, y: 0};

  constructor(props: IGestureWrapProps) {
    super(props);

    this.state = {
      mapScale: { x: 0.9, y: 0.9 },
      mapTranslate: { x: 0, y: 0 },
      panOffset: {x: 0, y:0},
      zoomOffset: {x: 0, y:0}
    };
  }

  public render() {
    let { mapTranslate, mapScale, panOffset, zoomOffset } = this.state;
    //console.log(mapTranslate);
    this.translation = {x: panOffset.x + zoomOffset.x, y: panOffset.y + zoomOffset.y}

    let hammerTime: React.CSSProperties = {
      transform: `translate(${this.translation.x}px, ${this.translation.y}px) scale(${mapScale.x}, ${mapScale.y})`,
    };

    return (
      <div id="GestureWrap" className={styles.gestureWrap}>
        <div className={styles.hammerStyle} style={hammerTime}> {this.props.children} </div>
      </div>
    );
  }

  /**
   * Lifecycle react method. This method is triggered when the react component is correctly loaded into the dom.
   * This is where all the eventhandlers are connected.
   */
  public componentDidMount() {
    let delay = 8;
    // ADD HAMMER
    var container: any = document.getElementById("GestureWrap");
    var mc = new Hammer.Manager(container);
    mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
    mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith(mc.get("pan"));
    mc.add(new Hammer.Tap({ event:'doubletap', taps: 2}));
    mc.on("panstart panmove", this.throttled(this.onPan, delay));
    mc.on("pinchstart pinchmove pinchend pinchcancel", this.throttled(this.onPinch, delay));
    mc.on("doubletap", this.throttled(this.onDoubleTap, delay));
    
    // OTHER EVENT LISTENERS
    window.addEventListener("wheel", this.throttled(this.onScroll, delay));
  }

  /**
   * Touch gestures
   */

  /**
   * Eventhandler for panning
   * Either by mouse or touch
   * @param e Event that triggered the handler
   */
  private onPan = (e: HammerInput) => {
    if (e.type === "panstart") {
      this.panStartCoords = {
        x: this.state.panOffset.x,
        y: this.state.panOffset.y
      };
    }

    this.setState({
      panOffset: {
        x: this.panStartCoords.x + e.deltaX,
        y: this.panStartCoords.y + e.deltaY
      }
    });
  };

  /**
   * Eventhandler for pinch zooming
   * @param e Event that triggered the handler
   */
  private onPinch = (e: HammerInput) => {
    if (e.type === "pinchstart") {
      this.pinchStart = { x: this.state.mapScale.x, y: this.state.mapScale.y };
    } 
  
    // Should maybe calculate the difference between the pinchstart hammer event scale.
    // Or maybe not.
    this.zoomRelative(e.scale, this.pinchStart.x, {x: e.center.x, y: e.center.y});
  };

  /**
   * OTHER HANDLERS
   */

  /**
   * Evenhandler for scroll zoom
   * @param e Event that triggered the handler
   */
  private onScroll = (e: React.WheelEvent) => {
    if(e.deltaY < 0){ // ZOOM IN
      this.zoomRelative(1.2, this.state.mapScale.x, {x: e.clientX, y: e.clientY});
    } else {          // ZOOM OUT
      this.zoomRelative(0.8, this.state.mapScale.x, {x: e.clientX, y: e.clientY});
    }
  };

  /**
   * Eventhandler for doubletapping to zoom
   * @param e Event that triggered the handler
   */
  private onDoubleTap = (e: HammerInput) => {
    this.zoomRelative(1.2, this.state.mapScale.x, e.center);
  }

  /** 
   * HELPERS
   */

  /**
   * Will perform a zoom relative to the pointer.
   * Will first find the real anchor of the zoom, which is
   * in the middle of the container.
   * Will then find the distance between the pointer and
   * the anchor.
   * Will then calculate the new anchor position after zoom.
   * @param scale Scale factor. 0-1 for zooming out, 1+ for zooming in.
   * @param pointer Point that should stay anchored during zoom
   */
  private zoomRelative(scale: number, referenceScale: number, pointer: {x: number, y: number}){
    // Figure out where the anchor is
    // Calc the difference between pointer and anchor
    // Adjust according to scale

    let { mapScale, zoomOffset, panOffset } = this.state;
    let newScale = referenceScale * scale;

    // Find anchor
    // Middle of screen, offset by translate
    let anchor = {
      x: (window.innerWidth / 2) + (zoomOffset.x + panOffset.x),
      y: (window.innerHeight / 2) + (zoomOffset .y + panOffset.y)
    };

    // Find distance between pointer and anchor
    let distance = {
      x: anchor.x - pointer.x,
      y: anchor.y - pointer.y
    };

    // Scale difference from before and new
    // Not always the same as the reference scale,
    // because of pinch
    let scaleDiff = newScale /  mapScale.x

    // Find distance after scaling
    let scaledDistance = {
      x: distance.x * scaleDiff,
      y: distance.y * scaleDiff
    };

    // Find the different in distance
    let distanceDifference = {
      x: scaledDistance.x - distance.x,
      y: scaledDistance.y - distance.y
    };

    // Set scale and add difference to transaltion
    this.setState({
      mapScale: {
        x: newScale,
        y: newScale
      },
      zoomOffset: {
        x: zoomOffset.x + distanceDifference.x,
        y: zoomOffset.y + distanceDifference.y
      }
    })

  }

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