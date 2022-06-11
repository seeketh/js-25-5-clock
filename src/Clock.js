import { useLayoutEffect, useRef, useState} from 'react';
//import './App.scss';
//import { Beep } from './Beep';

import { FaRegDotCircle } from 'react-icons/fa';
import { IoPlay, IoPause } from 'react-icons/io5';
import { RiRestartLine } from 'react-icons/ri';
import { IoCaretUp } from 'react-icons/io5';
import { IoCaretDown } from 'react-icons/io5';

import beep from "../audio/beep.wav";

function Clock() {

	// Single component 25+5 FCC clock.

	const [isRunning, setIsRunning] = useState(true); // Whether or Not the clock is running.
	const [isSession, setIsSession] = useState(true); // true -> session active, false -> break is active.
	const [sessionLength, setSessionLength] = useState(2); // Defaults to 25 mins.
	const [breakLength, setBreakLength] = useState(5); // Defaults to 5 mins.
	const [timeLeft, setTimeLeft] = useState(sessionLength * 60) // In seconds, Defaults to session length in seconds.
	const [clock, setClock] = useState("25:00");


	//const beep = useRef(null);
	const timeoutHandle = useRef(null);

	useLayoutEffect(() => {

        if ( (timeoutHandle !== null) & !isRunning ) { clearTimeout(timeoutHandle.current) }

		const secsToClock = (currentSeconds) => {
			setTimeLeft(currentSeconds);
			const timerMinutes = Math.floor(currentSeconds / 60);
			const timerSeconds = currentSeconds - timerMinutes * 60;
			const mins = timerMinutes < 10 ? "0" + timerMinutes.toString() : timerMinutes.toString();
			const secs = timerSeconds < 10 ? "0" + timerSeconds.toString() : timerSeconds.toString();
			setClock(mins + ":" + secs);
		}

		if (isRunning) {

			if (timeLeft > 0) {
				timeoutHandle.current = setTimeout(() => {
					secsToClock(timeLeft - 1);
                    console.log("we made it");
				}, 1000);

			} else if (timeLeft === 0) {
				//beep.current.play(); // Play the beep.
				timeoutHandle.current = setTimeout(() => {
					// Determine & change over to the next running mode.
					if (isSession) {
						// Next mode is Break
						secsToClock(breakLength * 60);
						setIsSession(false);
					} else {
						// Next mode is Session
						secsToClock(sessionLength * 60);
						setIsSession(true);
					}	
				}, 1000); // Permit a 1 second duration as 00:00 changes to next timer.

			}
		}
		//return () => { clearTimeout(timeoutHandle); }
	}, [isRunning, setIsSession, sessionLength, breakLength, setTimeLeft, isSession, timeLeft]);


	return (
			<div className="clock-box">
				<div className="display-box">
					<div className="title-box">

						<div className="session-title">
							<FaRegDotCircle className={isRunning ? "session-icon-active" : "session-icon-inactive"}/>
							<span className={isRunning ? "session-text-active" : "session-text-inactive"} id={"timer-label"}>
								{isSession ? "Session" : "Break"}
							</span>
						</div>

					</div>
					<div className="count-box">

						<div className="count-text">
						<span className="inner-count-text" id={"time-left"}>
								{ clock }
							</span> 
						</div>

					</div>
					<div className="control-box">

						<div onClick={handlePlayPause} id={"start_stop"}>
							{isRunning ? <IoPause className="play-btn"/> : <IoPlay className="play-btn"/>}
						</div>


						<div className="reset-box" onClick={handleReset} id={"reset"}>
							<RiRestartLine className="reset-btn"/>
						</div>
					</div>


					<Beep elRef={audioPlayer} />
					<div>
						<audio ref={elRef} src={beep} id={"beep"}>

						</audio>
					</div>

				</div>
				<div className="settings-box">
					<div className="spacer"></div>
					<div className="session-box">
						<div className="settings-btn">
							<div className="btn-title">
								<div className="settings-title-box">
									<span className="settings-title-text" id={"session-label"}>
										{"Session Length"}
									</span>
								</div>
							</div>

							<div className="settings-count">
								<span className="settings-count-text" id={"session-length"}>
									{sessionLength}
								</span>
							</div>

							<div className="btn-controls">

								<div className="increment-btn" onClick={handleClick} id={"session-increment"}>
									<IoCaretUp className="increment-icon" />
								</div>

								<div className="decrement-btn" onClick={handleClick}  id={"session-decrement"}>
									<IoCaretDown className="decrement-icon" />
								</div>

							</div>
						</div>
					</div>
					<div className="settings-btn">
						<div className="btn-title">
							<div className="settings-title-box">
								<span className="settings-title-text"  id={"break-label"}>
									{"Break Length"}
								</span>
							</div>
						</div>
						<div className="settings-count">
							<span className="settings-count-text" id={"break-length"}>
								{breakLength}
							</span>
						</div>
						<div className="btn-controls">

							<div className="increment-btn" onClick={handleClick} id={"break-increment"}>
								<IoCaretUp className="increment-icon" />
							</div>

							<div className="decrement-btn" onClick={handleClick}  id={"break-decrement"}>
								<IoCaretDown className="decrement-icon" />
							</div>

						</div>
					</div>
					<div className="spacer"></div>
				</div>
			</div>
	);

}

export { Clock };