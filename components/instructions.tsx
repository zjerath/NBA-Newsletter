import React from 'react';
import './component_styles/instructions.css'
import Image from 'next/image'

type InstructionsProps = {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Instructions = ({ openModal, setOpenModal }: InstructionsProps) => {
  return (
    <div className="popup-instructions">
        <svg onClick={() => {setOpenModal(false)}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="exitsvg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
        <div className="instructions-outer">
            <Image className="nbaimg"
                src="/NBA.png" alt="NBA Logo"
                width={26.25} height={60}/>
            <h1 className="instrheader1">NBANewsletter</h1>
            <p className="instrheader1">Your personal NBA betting assistant</p>
            <h2 className="instrheader2">Instructions</h2>
            <div className="instrstep">
                <div className="stepinner">
                    <p className="stepnum">Step 1.</p>
                    <p className="steptxt1">Type in a date as follows: 4/29/23.</p>
                </div>
            </div>
            <div className="instrstep">
                <div className="stepinner2">
                    <div className="flex">
                        <p className="stepnum">Step 2.</p>
                        <p className="steptxt2">Type in the bet you would like to analyze.</p>
                    </div>
                    <div className="flex">
                        <p className="example">Example:</p>
                        <p className="steptxt2under">"analyze my bets:</p>
                    </div>
                    <p className="steptxt2under2">Kevin Durant, Phoenix, Assists, Under."</p>
                </div>
            </div>
            <div className="instrstep">
                <div className="stepinner2">
                    <div className="flex">
                        <p className="stepnum">Step 3.</p>
                        <p className="steptxt3">Ask follow up questions about your bets to learn more about what happened!</p>
                    </div>
                    <div className="flex">
                        <p className="example">Example:</p>
                        <p className="steptxt2under">"Why did Kevin Durant have such few assists?"</p>
                    </div>
                </div>
            </div>
            <div className="instrnote">
                <div className="notebold">NOTE:</div>
                <div className="notereg">Each chat should be about 1 bet. If you want to ask about another bet, open a new chat.</div>
            </div>
        </div>
    </div>
    )
};

/* 
<ul>
    <li>Step 1: Type in a date as follows: 4/29/23</li>
    <li>
        <div>Step 2: Type the following:</div>
        <div>analyze my bets:</div>
        <div>YOUR BET HERE</div>
        <div>Example:</div>
        <div>analyze my bets:</div>
        <div>Kevin Durant, Phoenix, Assists Under</div>
    </li>
    <li>
        <div>Step 3: Ask follow up questions about your bets to learn more about what happened!</div>
        <div>Example: Why did Kevin Durant have such few assists?</div>
    </li>
</ul>
*/