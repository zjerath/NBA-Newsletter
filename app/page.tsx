import Image from 'next/image'
import './styles/home.css'

export default function Home() {
  return (
    <main className="main">
      <div className="div1">
        <div className="div2">
          <div className="div3">
            <div className="div4">
              <div className="div5">
                <Image className="nbaimg"
                src="/NBA.png" alt="NBA Logo"
                width={35} height={80}/>
                <h1 className="h1">NBANewsletter</h1>
                <div className="div6">
                  <div className="div7">
                    <h2 className="h2">
                      <svg stroke="currentColor" fill="none" 
                      strokeWidth="1.5" viewBox="0 0 24 24" 
                      strokeLinecap="round" className="svg">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                      </svg>
                      Examples
                    </h2>
                    <ul style={{padding: 0}} className="ul">
                      <li className="li">
                        "What was Curry's shooting percentage last night?"
                      </li>
                      <li className="li">
                        "Analyze my bets:
                        Kevin Durant, Phoenix, Assists, Under." 
                      </li>
                      <li className="li">
                        "How many points does Lebron average against the Warriors?"
                      </li>
                    </ul>
                  </div>
                  <div className="div7">
                    <h2 className="h2">
                      <svg stroke="currentColor" fill="none" 
                      strokeWidth="1.5" viewBox="0 0 24 24" 
                      aria-hidden="true" height="1em" width="1em"
                      xmlns="http://www.w3.org/2000/svg" className="svg">
                        <path strokeLinecap="round" strokeLinejoin="round" 
                        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"></path>
                      </svg>
                      Capabilities
                    </h2>
                    <ul style={{padding: 0}} className="ul">
                      <li className="li">
                        Allows user to ask about any game, past or present
                      </li>
                      <li className="li">
                        Leverages current statistics against historical averages
                      </li>
                      <li className="li">
                        Trained to understand both if and why user bets hit or missed
                      </li>
                    </ul>
                  </div>
                  <div className="div7">
                    <h2 className="h2">
                      <svg stroke="currentColor" fill="none" 
                      strokeWidth="1.5" viewBox="0 0 24 24" 
                      strokeLinecap="round" strokeLinejoin="round"
                      height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" 
                      className="svg">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      Limitations
                    </h2>
                    <ul style={{padding: 0}} className="ul">
                      <li className="li">
                        Inputted bets must be comma separated
                      </li>
                      <li className="li">
                        May occasionally produce incorrect or biased advice
                      </li>
                      <li className="li">
                        Unable to process bets made offline
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="div8"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}