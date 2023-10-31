import React, { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';
import { Levels, Sentry, Spinner } from "react-activity";
import "react-activity/dist/library.css";
import { members } from "./members";
import 'remixicon/fonts/remixicon.css'


function App() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [membershipId, setmembershipId] = useState(localStorage.getItem('mid') || "");
  const [askMembershipId, setAskMembershipId] = useState(() => {
    return localStorage.getItem("mid") ? false : true
  });
  const [midInput, setmidInput] = useState("");
  const [remainingSlots, setRS] = useState(localStorage.getItem('rs') || "100");
  const [userName, setUserName] = useState(localStorage.getItem('name') || "");
  const [showBackDrop, setSBD] = useState(false)
  const [viewTopCharts,SetViewTopCharts] = useState(() => {
   return localStorage.getItem("viewTopCharts") ? true : false
  }
  )

  console.log(viewTopCharts)

  let params = new URLSearchParams(window.location.search).get("photo");

  let photoActive = {};


  // const url = "https://backend-poll.onrender.com/api";
  const url = "http://localhost:3000/api";


  useEffect(() => {
    localStorage.setItem("viewTopCharts",JSON.stringify(viewTopCharts))
  },[viewTopCharts])

  useEffect(() => {
    if (!membershipId) {
      setAskMembershipId(true);
    }

    axios.get(url + "/all-polls").then(res => {
      setPolls(res.data.data)
      setLoading(false);
    })
  }, [membershipId])

  const saveMembershipId = () => {
    setSBD(true);
    const _refine = midInput.replace(" ", "").toUpperCase();
    const _ = members.filter(value => {
      if (value["Membership ID"]) {
        // console.log(_refine, String(value["Membership ID"]).split(" ").join("").trim());
        if (String(value["Membership ID"]).split(" ").join("").trim() == _refine) return value;
      }
    });
    if (_.length > 0) {
      axios.get(url + "/user/" + _refine).then(res => {
        setRS(res.data.votes);
        localStorage.setItem('rs', res.data.votes);
        setUserName(_[0]["Name"]);
        localStorage.setItem('name', _[0]["Name"]);
      })
      setmembershipId(_refine);
      localStorage.setItem('mid', _refine);
      setAskMembershipId(false);
      setSBD(false)
    }
    if (_.length == 0) {
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
    axios.post(url + "/vote", data).then(res => setPolls(res.data.data))
  }

  const getName = (id) => {
    const _ = members.filter(value => {
      if (value["Membership ID"]) {
        // console.log(_refine, String(value["Membership ID"]).split(" ").join("").trim());
        if (String(value["Membership ID"]).split(" ").join("").trim() == id) return value;
      }
    });

    if (_.length > 0) {
      return _[0]["Name"]
    }
  }

  const getAPoll = (id) => {
    const _ = polls.filter(value => {
      if (value.id == id) return value;
    });
    if (_.length > 0) {
      return _[0];
    }
    params = "";
    return;
  }

  if (params != "") {
    photoActive = getAPoll(params);
  }

  const getTopChart = () => {
    let _sorted = polls;
    let sorted = _sorted.sort((a,b)=> b.voters.length-a.voters.length);
    return sorted;
  }


  return (
    <>
      <header className='flex items-center justify-between'>
        <div className='heading_container'>
          <h2>Nagarjuna ICT Club - Photography Contest</h2>
        </div>
        <div className="header_search_area flex items-center gap-[1rem]">
          <p>Voting open</p>
          <Sentry color="#49b33e" size={24} speed={.5} animating={true} />
        </div>
      </header>
      {showBackDrop && <CustomBackDrop />}
      {userName && <p className=' px-4 py-1 remaining_notice'>Remaining Vote Count for <b>{userName}</b> :- <span>{remainingSlots}</span></p>}
      {askMembershipId && <dialog className='flex items-center py-2 w-full h-full justify-center z-[100] backdrop:backdrop-blur-sm rounded-md'>
        <div className='flex flex-col gap-[1rem] border border-solid border-[#000] px-4 py-5'>
          <p>Enter your <em>Membership ID</em> to participate in this photography contest voting</p>
          <input
            type="text"
            name=""
            id=""
            onChange={e => setmidInput(e.target.value)}
            placeholder='Enter Membership ID'
            className='border border-solid border-[#000] px-1 py-2'
          />
          <button onClick={() => saveMembershipId()} className='border border-solid bg-primary text-[#fff] py-1'>SAVE</button>
        </div>
      </dialog>}
      { !viewTopCharts && (
      <div className=' px-4 pt-3 '>
        <button className='border border-solid bg-primary text-[#fff] w-full py-1' onClick={() => SetViewTopCharts(true)} >View Top Charts</button>
      </div>
      )

      }
      <div className='poll_container py-3 '>
        {loading ? <div> <CustomBackDrop color={"white"} /> </div> :
          !askMembershipId &&
            photoActive ? <div className='single_active'>
            <img src={photoActive?.url} />
            <div className='flex flex-col gap-1'>
              <h2>Author: {getName(photoActive.author)} ({photoActive.author})</h2>
              <h2>Vote Counts: {photoActive.voters.length}</h2>
              <h2>Uploaded on: {new Date(photoActive.createdAt).toUTCString()}</h2>
              <div className='card_footer'>
                <button className="vote_button" onClick={() => makeVote(photoActive.id)}>Vote <i className="ri-heart-add-fill"></i> </button>
                <button disabled className='votes_count'>
                  <i className="ri-heart-2-fill"></i>
                  {photoActive.voters.length}
                  <Levels />
                </button>
                <button className='view_btn' onClick={() => location.href = "/"}>
                  View All
                </button>
              </div>
            </div>
          </div>
            :
             <>
             {
              viewTopCharts && (
              <div className='top_charts px-4 py-2 pb-4 flex flex-col gap-2'>
                <h2 className=' text-xl'>Top Chart <i className="ri-award-fill"></i> </h2>
                {getTopChart().map((top,key)=>{
            
                  if(top?.voters?.length>0){
                    return <div key={key} className='flex gap-2'>
                      <img src={top.url} width={'100'} loading="lazy" />
                      <div>
                      <span className='text-muted photo_id text-sm'>{top.id}</span>
                      <p>{top.author}</p>
                      <p className=' font-bold'>{getName(top.author)}</p>
                      </div>
                    </div>
                  }
                })}
              </div>
              )
             }
              <div className='all_polls'>
                {
                  polls.map((vlaue, k) => {
                    return <div key={k} className='poll_card flex flex-col gap-1'>
                      <img src={vlaue?.url} />
                      <div className='flex flex-col gap-1'>
                        <span className='photo_id'>{vlaue.id}</span>
                        <h2>Author: {getName(vlaue.author)} ({vlaue.author})</h2>
                        <h2>Vote Counts: {vlaue.voters.length}</h2>
                        <h2>Uploaded on: {new Date(vlaue.createdAt).toUTCString()}</h2>
                        <div className='card_footer'>
                          <button className="vote_button" onClick={() => makeVote(vlaue.id)}>Vote <i className="ri-heart-add-fill"></i> </button>
                          <button disabled className='votes_count'>
                            <i className="ri-heart-2-fill"></i>
                            {vlaue.voters.length}
                            <Levels />
                          </button>
                          <button className='view_btn' onClick={() => location.href += "/?photo=" + vlaue.id}>
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  })
                }


              </div>
            </>
        }
      </div>
    </>
  )
}

const CustomBackDrop = (color?: any) => {
  return <div className='custom_backdrop' style={color && { backgroundColor: color.color }}>
    <Spinner />
  </div>
}

export default App
