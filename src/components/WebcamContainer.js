/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useCallback } from "react";
import { Card, Container, CardMedia, CardContent, Typography, CardActions, Button } from "@material-ui/core";
import Webcam from "react-webcam";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
    webcamContainer: {
        width: "100%",
        maxHeight: 400,
        display: "flex",
        justifyContent: "center"
    }
});

const WebcamContainer = (props) => {
    const { classes } = props;
    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const handleStartCaptureClick = useCallback(() => {
        setCapturing(true);
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
          mimeType: "video/webm"
        });
        mediaRecorderRef.current.addEventListener(
          "dataavailable",
          handleDataAvailable
        );
        mediaRecorderRef.current.start();
      }, [webcamRef, setCapturing, mediaRecorderRef]);
    
      const handleDataAvailable = useCallback(
        ({ data }) => {
          if (data.size > 0) {
            setRecordedChunks((prev) => prev.concat(data));
          }
        },
        [setRecordedChunks]
      );
    
      const handleStopCaptureClick = useCallback(() => {
        mediaRecorderRef.current.stop();
        setCapturing(false);
      }, [mediaRecorderRef, webcamRef, setCapturing]);

      const handleDownload = useCallback(() => {
        if (recordedChunks.length) {
          const blob = new Blob(recordedChunks, {
            type: "video/webm"
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          document.body.appendChild(a);
          a.style = "display: none";
          a.href = url;
          a.download = "react-webcam-stream-capture.webm";
          a.click();
          window.URL.revokeObjectURL(url);
          setRecordedChunks([]);
        }
      }, [recordedChunks]);

    return (
        <Container>

            <Card>
                <CardMedia className={classes.webcamContainer}
                > <Webcam audio ref={webcamRef} /></CardMedia>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Record your video
                    </Typography>
                    <Typography variant="body2">
                        Say something ...
                    </Typography>
                </CardContent>
                <CardActions>
                    {capturing ? (
          <Button color="primary" size="small" onClick={handleStopCaptureClick}>Stop Capture</Button>
        ) : (
          <Button color="primary" size="small" onClick={handleStartCaptureClick}>Start Capture</Button>
        )}
 
          <Button color="primary" size="small" disabled={!recordedChunks.length > 0} onClick={handleDownload}>Download</Button>
     
                </CardActions>
            </Card>
        </Container>
    )
}

export default withStyles(styles)(WebcamContainer);