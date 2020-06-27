import React from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
import { db } from '../firebase/Fire';

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

class Audio extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isRecording: false,
      blobURL: '',
      isBlocked: false,
      show:false
    };
  }

  start = () => {
      this.setState({show:true})
      this.props.setRecording(true)
    if (this.state.isBlocked) {
      console.log('Permission Denied');
    } else {
      Mp3Recorder
        .start()
        .then(() => {
          this.setState({ isRecording: true });
        }).catch((e) => console.error(e));
    }
  };

  stop = () => {
    this.setState({show:false})
    this.props.setRecording(false)
    Mp3Recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        
        
        this.setState({isRecording: false });
        this.props.insertAudio(blob);
        
      }).catch((e) => console.log(e));
  };

  componentDidMount() {
    // navigator.getUserMedia({ audio: true },
    //   () => {
    //     console.log('Permission Granted');
    //     this.setState({ isBlocked: false });
    //   },
    //   () => {
    //     console.log('Permission Denied');
    //     this.setState({ isBlocked: true })
    //   },
    // );
  }

  render(){
    return (
      <div className="col-2" >
     
          <button   style={{display: this.state.show? "none":"block"}} className="btn  round text-center mt-3" onMouseDown={this.start}  ><i className="fa fa-microphone fa-2x"></i></button>
          <button style={{display: this.state.show? "block":"none"}} className="btn btn2 round text-center mt-3" onClick={this.stop} ><i className="fa fa-microphone-slash fa-2x"></i> </button>
      
      </div>
    );
  }
}

export default Audio;