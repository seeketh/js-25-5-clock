import * as React from "https://cdn.skypack.dev/react@17.0.1";
import { IoCaretDown, IoCaretUp, IoPlay, IoPause } from 'react-icons/io5';
import { RiRestartLine } from 'react-icons/ri';
import { FaRegDotCircle } from 'react-icons/fa';

class SettingsBox extends React.Component {

    render()
    {
        return (
            <div className="session-box">
                <div className="settings-btn">
                    <div className="btn-title">
                        <div className="settings-title-box">
                            <div className="settings-title-text" id={this.props.settingsLabelId}>
                                {this.props.settingsLabel}
                            </div>
                        </div>
                    </div>

                    <div className="settings-count">
                        <div className="settings-count-text" id={this.props.settingsCountId}>
                            {this.props.settingsCount}
                        </div>
                    </div>

                    <div className="btn-controls">
                        <div className="increment-btn" onClick={this.props.incrementFn}id={this.props.incrementBtnId}>
                            <IoCaretUp className="increment-icon" />
                        </div>
                        <div className="decrement-btn" onClick={this.props.decrementFn} id={this.props.decrementBtnId}>
                            <IoCaretDown className="decrement-icon" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

class Clock extends React.Component {

	constructor(props)
	{
		super(props);

		this.state = {
			isRunning: false,
	        isSession: true,
	        sessionLength: 25,
	        breakLength: 5,
	        timeLeft: 1500,
	        clock: "25:00",
          intervalId: null
		};

        this.handleIncrement = this.handleIncrement.bind(this);
        this.handleDecrement = this.handleDecrement.bind(this);
        this.handlePlayPause = this.handlePlayPause.bind(this);

        this.handleSessionIncr = this.handleSessionIncr.bind(this);
        this.handleBreakIncr = this.handleBreakIncr.bind(this);
        this.handleSessionDecr = this.handleSessionDecr.bind(this);
        this.handleBreakDecr = this.handleBreakDecr.bind(this);

        this.handleReset = this.handleReset.bind(this);
        this.secsToClock = this.secsToClock.bind(this);
        this.countDown = this.countDown.bind(this);
	}

    handlePlayPause()
    {
		console.log("Runb4", this.state.isRunning);
        
        if (this.state.isRunning) {
            clearInterval(this.state.intervalId);
            this.setState({isRunning: false});
        } else {
            this.setState({intervalId: setInterval(() => {this.countDown()}, 1000)});
            this.setState({isRunning: true});
        }

		console.log("RunAf", !this.state.isRunning);
    }

    handleReset()
    {
        clearInterval(this.state.intervalId);

        this.setState({
                isRunning: false,
                isSession: true,
                sessionLength: 25,
                breakLength: 5,
                timeLeft: 1500,
                clock: "25:00",
                intervalId: null
        });

        let beep = document.getElementById('beep');
        beep.pause();
        beep.currentTime = 0;

		console.log("Resetted");
    }

    handleIncrement(settingsLength, lengthType, mode)
    {
        if ((settingsLength < 60 ) && !this.state.isRunning) {

            if (mode) {
                this.setState({
                    [lengthType]: settingsLength + 1,
                    timeLeft: (settingsLength + 1) * 60,
                    clock: (settingsLength + 1) >= 10 ? `${(settingsLength + 1)}:00` : `0${(settingsLength + 1)}:00`
                });
            } else {
                this.setState({ [lengthType]: settingsLength + 1 });           
            }
        }
    }

    handleDecrement(settingsLength, lengthType, mode)
    {
        if ((settingsLength > 1 ) && !this.state.isRunning) {

            if (mode) {
                this.setState({
                    [lengthType]: settingsLength - 1,
                    timeLeft: (settingsLength - 1) * 60,
                    clock: (settingsLength - 1) >= 10 ? `${(settingsLength - 1)}:00` : `0${(settingsLength - 1)}:00`
                });
            } else {
                this.setState({ [lengthType]: settingsLength - 1 });           
            }
        }
    }

    handleSessionIncr(){
        this.handleIncrement(this.state.sessionLength, "sessionLength", this.state.isSession);
    }

    handleBreakIncr(){
        this.handleIncrement(this.state.breakLength, "breakLength", !this.state.isSession);
    }

    handleSessionDecr(){
        this.handleDecrement(this.state.sessionLength, "sessionLength", this.state.isSession);
    }

    handleBreakDecr(){
        this.handleDecrement(this.state.breakLength, "breakLength", !this.state.isSession)
    }

    secsToClock(currentSeconds)
    {
        const timerMinutes = Math.floor(currentSeconds / 60);
        const timerSeconds = currentSeconds - timerMinutes * 60;
        const mins = timerMinutes < 10 ? `0${timerMinutes}` : `${timerMinutes}`;
        const secs =  timerSeconds < 10 ? `0${timerSeconds}` : `${timerSeconds}`;

        this.setState({
            timeLeft: currentSeconds,
            clock: `${mins}:${secs}`
        })
    }

    // Timer Count Down
    countDown()
    {
        if (this.state.timeLeft > 0 && this.state.isRunning) {
            console.log("> 0 Secs Left", this.state.timeLeft - 1);
            this.secsToClock(this.state.timeLeft - 1);
        } else if (this.state.timeLeft === 0) {
            // Play the beep.
            document.getElementById('beep').play();
            // Determine & change over to the next running mode.
            if (this.state.isSession) {
                this.secsToClock(this.state.breakLength * 60);
                // Next mode is Break
                this.setState({ isSession: false });
            } else { 
                this.secsToClock(this.state.sessionLength * 60);
                // Next mode is Session
                this.setState({ isSession: true });
            }	
        }
    }

    render()
    {
        return (
			<div className="clock-box">

				<div className="display-box">

					<div className="title-box">
						<div className="session-title">
                            <FaRegDotCircle className={this.state.isRunning ? "session-icon-active" : "session-icon-inactive"}/>
							<span className={this.state.isRunning ? "session-text-active" : "session-text-inactive"} id={"timer-label"}>
								{this.state.isSession ? "Session" : "Break"}
							</span>
						</div>
					</div>

					<div className="count-box">
						<div className="count-text">
						    <div className="inner-count-text" id={"time-left"}>
								{ this.state.clock }
							</div> 
						</div>
					</div>

					<div className="control-box">

						<div onClick={this.handlePlayPause} id={"start_stop"}>
                            {this.state.isRunning ? <IoPause className="play-btn"/> : <IoPlay className="play-btn"/>}
						</div>

						<div className="reset-box" onClick={this.handleReset} id={"reset"}>
                            <RiRestartLine className="reset-btn"/>
						</div>

					</div>

					<div>
						<audio src="https://sampleswap.org/samples-ghost/DRUM%20LOOPS%20and%20BREAKS/111%20to%20120%20bpm/369[kb]113_submarine-alarm.wav.mp3" id={"beep"}></audio>
					</div>

				</div>

				<div className="settings-box">

					<div className="spacer"></div>

					<SettingsBox
						settingsLabelId="session-label"
						settingsLabel="Session Length"
						settingsCountId="session-length"
						settingsCount={this.state.sessionLength}
						incrementBtnId="session-increment"
						decrementBtnId="session-decrement"
                        incrementFn={this.handleSessionIncr}
                        decrementFn={this.handleSessionDecr}
					/>

					<SettingsBox
						settingsLabelId="break-label"
						settingsLabel="Break Length"
						settingsCountId="break-length"
						settingsCount={this.state.breakLength}
						incrementBtnId="break-increment"
						decrementBtnId="break-decrement"
                        incrementFn={this.handleBreakIncr}
                        decrementFn={this.handleBreakDecr}
					/>

					<div className="spacer"></div>
				</div>
			</div>
	);
    }

}

export {Clock}