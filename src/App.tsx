import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { Levels, Spinner } from "react-activity";
import "react-activity/dist/library.css";
import { members } from "./members";
import "remixicon/fonts/remixicon.css";
import Header from "./components/Header";

function App() {
  const [polls, setPolls] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [membershipId, setmembershipId] = useState<string>(
    localStorage.getItem("mid") || ""
  );
  const [askMembershipId, setAskMembershipId] = useState<boolean>(() => {
    return localStorage.getItem("mid") ? false : true;
  });
  const [midInput, setmidInput] = useState<string>("");
  const [remainingSlots, setRS] = useState(localStorage.getItem("rs") || "100");
  const [userName, setUserName] = useState<string>(
    localStorage.getItem("name") || ""
  );
  const [showBackDrop, setSBD] = useState(false);
  // since viewtopcharts doesnot return null so non-null assertion operator is used
  // reference:- https://stackoverflow.com/questions/46915002/argument-of-type-string-null-is-not-assignable-to-parameter-of-type-string
  // const [viewTopCharts, SetViewTopCharts] = useState(() => {
  //    return localStorage.getItem("viewTopCharts") && localStorage.getItem("viewTopCharts") !== null && (JSON.parse(localStorage.getItem(("viewTopCharts"))!) == true && true) || false
  // }
  // );
  const [viewTopCharts, SetViewTopCharts] = useState(false);

  let params = new URLSearchParams(window.location.search).get("photo");

  interface IphotoActive {
    url: string;
    author: string;
    voters: [];
    createdAt: string;
    id: string;
  }

  interface ItopVoters {
    voters: [];
    url: string;
    id: string;
    author: string;
  }

  interface Ivalue {
    url: string;
    id: string;
    author: string;
    voters: [];
    createdAt: string;
  }

  let photoActive: IphotoActive = {
    url: "",
    author: "",
    voters: [],
    createdAt: "",
    id: "",
  };

  // const url = "https://backend-poll.onrender.com/api";
  const url = "http://localhost:3000/api";

  useEffect(() => {
    localStorage.setItem("viewTopCharts", JSON.stringify(viewTopCharts));
    return () => localStorage.removeItem("viewTopCharts");
  }, [viewTopCharts]);

  useEffect(() => {
    if (!membershipId) {
      setAskMembershipId(true);
    }

    axios.get(url + "/all-polls").then((res) => {
      setPolls(res.data.data);
      setLoading(false);
    });
  }, [membershipId]);

  const saveMembershipId = () => {
    setSBD(true);
    const _refine = midInput.replace(" ", "").toUpperCase();
    const _ = members.filter((value) => {
      if (value["Membership ID"]) {
        // console.log(_refine, String(value["Membership ID"]).split(" ").join("").trim());
        if (
          String(value["Membership ID"]).split(" ").join("").trim() == _refine
        )
          return value;
      }
    });
    if (_.length > 0) {
      axios.get(url + "/user/" + _refine).then((res) => {
        setRS(res.data.votes);
        localStorage.setItem("rs", res.data.votes);
        setUserName(String(_[0]["Name"]));
        localStorage.setItem("name", JSON.stringify(_[0]["Name"]));
      });
      setmembershipId(_refine);
      localStorage.setItem("mid", _refine);
      setAskMembershipId(false);
      setSBD(false);
    }
    if (_.length == 0) {
      alert("Membership ID incorrect");
    }
  };

  const makeVote = (photoId: string) => {
    if (!membershipId) {
      setAskMembershipId(true);
      return;
    }
    const data = {
      id: photoId,
      voter: membershipId,
    };
    axios.post(url + "/vote", data).then((res) => setPolls(res.data.data));
  };

  const getName = (id: string) => {
    const _ = members.filter((value) => {
      if (value["Membership ID"]) {
        // console.log(_refine, String(value["Membership ID"]).split(" ").join("").trim());
        if (String(value["Membership ID"]).split(" ").join("").trim() == id)
          return value;
      }
    });

    if (_.length > 0) {
      return _[0]["Name"];
    }
  };

  const getAPoll = (id: object) => {
    const _ = polls.filter((value) => {
      if (value.id == id) return value;
    });
    if (_.length > 0) {
      return _[0];
    }
    params = "";
    return;
  };

  if (params != "") {
    photoActive = getAPoll(Object(params));
  }

  const getTopChart = () => {
    const _sorted = polls;
    if (_sorted !== null) {
      const sorted = _sorted.sort((a, b) => b.voters.length - a.voters.length);
      return sorted;
    }
  };

  return (
    <>
      <Header />
      {showBackDrop && <CustomBackDrop color="white" />}
      {userName && (
        <p className=" px-4 py-1 remaining_notice">
          Remaining Vote Count for <b>{userName}</b> :-{" "}
          <span>{remainingSlots}</span>
        </p>
      )}
      {askMembershipId && (
        <dialog className="flex items-center py-2 w-full h-full justify-center z-[100] backdrop:backdrop-blur-sm rounded-md">
          <div className="flex flex-col gap-[1rem] border border-solid border-[#000] px-4 py-5">
            <p>
              Enter your <em>Membership ID</em> to participate in this
              photography contest voting
            </p>
            <input
              type="text"
              name=""
              id=""
              value={midInput}
              onChange={(e) => setmidInput(e.target.value)}
              placeholder="Enter Membership ID"
              className="border border-solid border-[#000] px-1 py-2"
            />
            <button
              onClick={() => saveMembershipId()}
              className="border border-solid bg-primary text-[#fff] py-1"
            >
              SAVE
            </button>
          </div>
        </dialog>
      )}
      {
        <div className=" px-4 pt-3 sm:hidden ">
          <button
            className="border border-solid bg-primary text-[#fff] w-full py-1"
            onClick={() =>
              window.innerWidth < 640 && SetViewTopCharts((prev) => !prev)
            }
          >
            {!viewTopCharts ? `View Top Charts` : `View All`}
          </button>
        </div>
      }

      <div className="poll_container py-3 ">
        {loading ? (
          <div>
            {" "}
            <CustomBackDrop color={"white"} />{" "}
          </div>
        ) : !askMembershipId && photoActive ? (
          <div className="single_active">
            <img src={photoActive?.url} />
            <div className="flex flex-col gap-1">
              <h2>
                Author: {getName(photoActive.author)} ({photoActive.author})
              </h2>
              <h2>Vote Counts: {photoActive.voters.length}</h2>
              <h2>
                Uploaded on: {new Date(photoActive.createdAt).toUTCString()}
              </h2>
              <div className="card_footer">
                <button
                  className="vote_button"
                  onClick={() => makeVote(photoActive.id)}
                >
                  Vote <i className="ri-heart-add-fill"></i>{" "}
                </button>
                <button disabled className="votes_count">
                  <i className="ri-heart-2-fill"></i>
                  {photoActive.voters.length}
                  <Levels />
                </button>
                <button
                  className="view_btn"
                  onClick={() => {
                    location.href = "/";
                  }}
                >
                  View All
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {viewTopCharts && (
              <div className="top_charts px-4 py-2 pb-4 flex flex-col gap-2">
                <h2 className=" text-xl">
                  Top Chart <i className="ri-award-fill"></i>{" "}
                </h2>
                {getTopChart().map((top: ItopVoters, key) => {
                  if (top?.voters?.length > 0) {
                    return (
                      <div key={key} className="flex gap-2">
                        <img src={top.url} width={"100"} loading="lazy" />
                        <div>
                          <span className="text-muted photo_id text-sm">
                            {top.id}
                          </span>
                          <p>{top.author}</p>
                          <p className=" font-bold">{getName(top.author)}</p>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            )}
            {!viewTopCharts && (
              <div className="all_polls">
                {polls.map((value: Ivalue, k) => {
                  return (
                    <div key={k} className="poll_card flex flex-col gap-1">
                      <img src={value?.url} />
                      <div className="flex flex-col gap-1">
                        <span className="photo_id">{value.id}</span>
                        <h2>
                          Author: {getName(value.author)} ({value.author})
                        </h2>
                        <h2>Vote Counts: {value.voters.length}</h2>
                        <h2>
                          Uploaded on: {new Date(value.createdAt).toUTCString()}
                        </h2>
                        <div className="card_footer">
                          <button
                            className="vote_button"
                            onClick={() => makeVote(value.id)}
                          >
                            Vote <i className="ri-heart-add-fill"></i>{" "}
                          </button>
                          <button disabled className="votes_count">
                            <i className="ri-heart-2-fill"></i>
                            {value.voters.length}
                            <Levels />
                          </button>
                          <button
                            className="view_btn"
                            onClick={() =>
                              (location.href += "/?photo=" + value.id)
                            }
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

const CustomBackDrop = (color: { color: string }) => {
  return (
    <div
      className="custom_backdrop"
      style={color && { backgroundColor: color.color }}
    >
      <Spinner />
    </div>
  );
};

export default App;
