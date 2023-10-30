import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';
import { Dots, Levels } from "react-activity";
import "react-activity/dist/library.css";
import {members} from "./members";
import 'remixicon/fonts/remixicon.css'


function App() {


  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [membershipId, setmembershipId] = useState(localStorage.getItem('mid') || "");
  const [askMembershipId, setAskMembershipId] = useState(false);
  const [midInput, setmidInput] = useState("");

  // const url = "https://backend-poll.onrender.com/api/all-polls";
  const url = "http://localhost:3000/api";

  useEffect(() => {
    if (!membershipId) {
      setAskMembershipId(true);
    }

    axios.get(url+"/all-polls").then(res => {
      setPolls(res.data.data)
      setLoading(false);
    })
  }, [membershipId])

  const saveMembershipId = () => {
    const _refine = midInput.replace(" ","").toUpperCase();
    const _  = members.filter(value=>{
      if(value["Membership ID"]){
        // console.log(_refine, String(value["Membership ID"]).split(" ").join("").trim());
        if(String(value["Membership ID"]).split(" ").join("").trim() == _refine) return value;
      }
    });
    if(_.length>0){
      setmembershipId(_refine);
      localStorage.setItem('mid', _refine);
      setAskMembershipId(false);
    }
    if(_.length==0){
      alert("Membership ID incorrect");
    }
  }


  const makeVote = (photoId: string) => {
    if (!membershipId) {
      setAskMembershipId(true);
      return;
    }
    const data = {
      id: photoId,
      voter: membershipId
    }

    axios.post(url+"/vote",data).then(res=>setPolls(res.data.data))

  }

  return (
    <>
      <header>
        <div className='heading_container'>
          <h2>Nagarjuna ICT Club - Photography Contest</h2>
        </div>
        <div className="header_search_area">
          {/* <input type="text" name="" id="" /> */}
          <p>Voting open</p>
          <Dots />
        </div>
      </header>
      {askMembershipId && <div>
          <input type="text" name="" id="" onChange={e=>setmidInput(e.target.value)} />
          <button onClick={()=>saveMembershipId()}>SAVE</button>
        </div>}
      <div className='poll_container'>
        {loading ? <p>loading</p> :
          <div className='all_polls'>
            {
              polls.map((vlaue, k) => {
                return <div key={k} className='poll_card'>
                  <img src={vlaue?.url} />
                  <h2>Author: {vlaue.author}</h2>
                  <h2>Vote Counts: {vlaue.voters.length}</h2>
                  <h2>Uploaded on: {new Date(vlaue.createdAt).toUTCString()}</h2>
                  <div className='card_footer'>
                  <button  className="vote_button"onClick={() => makeVote(vlaue.id)}>Vote <i className="ri-heart-add-fill"></i> </button>
                  <button disabled className='votes_count'>
                   <i className="ri-heart-2-fill"></i>
                    {vlaue.voters.length}
                    <Levels />
                   </button>
                  </div>
                </div>
              })
            }
          </div>
        }
      </div>
    </>
  )
}

export default App
