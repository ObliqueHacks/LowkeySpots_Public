import { useEffect, useState } from "react";

/* COMPONENTS */
import Sidebar from "../global/Sidebar";
import Topbar from "../global/Topbar.tsx";
import MapDisplay from "../../components/map/MapDisplay.tsx";
import MapFriends from "../../components/friends/MapFriends.tsx";
import axios from "../../api/axios";
import CardSkeleton from "../../components/CardSkeleton.tsx";

/* LIRBARIES */
import { Fade } from "react-awesome-reveal";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { AspectRatio } from "react-aspect-ratio";
import { ToastContainer, toast } from "react-toastify";

/* OTHER */
import "react-loading-skeleton/dist/skeleton.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

/* API URLS */
const CREATE_MAP_URL = "api-auth/map/make-map/";
const GET_MAP_IDS_URL = "api-auth/map/get-user-maps/";
const GET_MAP_URL = "api-auth/map/get-map/";
const DELETE_MAP_URL = "api-auth/map/delete-map/";

const Dashboard = () => {
  const [editMap, setEditMap] = useState(false);
  const [mapName, setMapName] = useState("");
  const [mapIds, setMapIds] = useState([]);
  const [member, setMember] = useState(false);
  const [addFriend, setAddFriend] = useState(false);

  const [mapImg, setMapImg] = useState<{ preview: string; file: File | null }>({
    preview: "",
    file: null,
  });

  const [filter, setFilter] = useState("All");
  const status = ["Admin", "Collaborator", "Spectator"];

  const [loading, setLoading] = useState(true);

  const [selectedMap, setSelectedMap] = useState<{
    mapName: string;
    mapImage: { preview: string; file: File | null };
    status: number;
    mapId: number;
  } | null>(null);

  const [displayMaps, setDisplayMaps] = useState<
    Array<{
      mapName: string;
      mapImage: { preview: string; file: File | null };
      status: number;
      mapId: number;
    }>
  >([]);

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      if (acceptedFiles?.length > 0) {
        const firstAcceptedFile = acceptedFiles[0];

        setMapImg({
          preview: URL.createObjectURL(firstAcceptedFile),
          file: firstAcceptedFile, // Save the file itself if needed
        });
      }
    },
    [setMapImg]
  );

  const getMapIds = async () => {
    try {
      const response = await axios.post(
        GET_MAP_IDS_URL,
        {},
        {
          headers: { "Content-type": "application/json" },
          withCredentials: true,
        }
      );
      setMapIds(response.data.mapId);
    } catch (err: any) {
      if (err.response?.status == 408) {
        console.log("Token Invalid. Relogin");
      } else {
        console.log("No server response");
      }
    }
  };

  const getMaps = async () => {
    try {
      let updatedDisplayMaps: any = [];

      for (const id of mapIds) {
        const response = await axios.post(
          GET_MAP_URL,
          JSON.stringify({ mapId: id }),
          {
            headers: {
              "Content-type": "application/json",
            },
            withCredentials: true,
          }
        );

        const path = response.data?.folderName;
        const file = new File([response.data], "MAP_IMAGE.jpg", {
          type: "image/jpeg",
        });

        updatedDisplayMaps.push({
          mapName: response.data.mapData.title,
          mapImage: {
            preview: path,
            file: file,
          },
          status: response.data.status,
          mapId: id,
        });
      }

      // Clear existing maps and set the updated ones
      setTimeout(() => {
        setDisplayMaps(updatedDisplayMaps);
        setLoading(false);
      }, 700);
    } catch (err: any) {
      console.log(err.response);
      if (err.response?.status === 400) {
        console.log("Something wrong with Map ID");
      } else if (err.response?.status === 408) {
        console.log("User Token Expired. Relogin");
      } else {
        console.log("No server response");
      }
    }
  };

  // useEffect to call getMapIds when the component is loaded
  useEffect(() => {
    getMapIds();
  }, []);

  // useEffect to call getMaps when mapIds changes
  useEffect(() => {
    getMaps();
  }, [mapIds]);

  const createMap = async (
    e: any,
    title: string,
    img: { preview: string; file: File | null }
  ) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("title", title);
      if (img.file) {
        formData.append("image", img.file);
      }

      const response: any = await axios.post(CREATE_MAP_URL, formData, {
        headers: { "Content-type": "multipart/form-data" },
        withCredentials: true,
      });
      console.log(response);

      getMapIds();
      getMaps();
    } catch (err: any) {
      console.log(err.response);
      if (err.response?.status === 400) {
        toast.error("Something went wrong!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else if (err.response?.status === 408) {
        toast.error("You timed out! Please Relogin.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else if (err.response?.status === 413) {
        toast.error("Your title is too long! Please use a shorter name.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else if (err.response?.status === 413) {
        toast.error("Invalid Image Format! Please use JPG or PNG.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        console.log("No server response");
      }
    }
  };

  const deleteMap = async (displayMap: any, e: any) => {
    // Prevent the click event from propagating to the parent card body
    e.stopPropagation();
    try {
      const response = await axios.post(
        DELETE_MAP_URL,
        JSON.stringify({ mapId: displayMap.mapId }),
        {
          headers: {
            "Content-type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(response);
      getMapIds();
    } catch (err: any) {
      console.log(err.response);
      if (err.response?.status === 400) {
        console.log("Something wrong with Map ID");
      } else if (err.response?.status === 408) {
        console.log("User Token Expired. Relogin");
      } else {
        console.log("No server response");
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="container">
      <Sidebar editMap={editMap} map={selectedMap}></Sidebar>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {!editMap && (
        <Fade>
          <div className="maps">
            <Topbar></Topbar>
            <div className="mheader">
              <h1>Your Maps</h1>

              <div className="main-buttons">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {filter}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => setFilter("All")}
                    >
                      All
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => setFilter("Admin")}
                    >
                      Admin
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => setFilter("Collaborator")}
                    >
                      Collaborator
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => setFilter("Spectator")}
                    >
                      Spectator
                    </a>
                  </li>
                </ul>

                <button
                  className="add-map"
                  data-bs-toggle="modal"
                  data-bs-target="#newMapForm"
                >
                  <span className="material-symbols-outlined">add</span>New Map
                </button>
              </div>
            </div>
            <div className="map-dashboard">
              <ul className="map-list">
                {loading && <CardSkeleton cards={mapIds.length} />}
                {filter === "All"
                  ? displayMaps.map((displayMap, index) => (
                      <li key={index}>
                        <div className="card">
                          <AspectRatio
                            ratio="3/4"
                            style={{ maxHeight: "175px" }}
                          >
                            {" "}
                            <img
                              src={displayMap.mapImage.preview}
                              className="card-img-top"
                              alt=""
                            />
                          </AspectRatio>
                          <div
                            className="card-body"
                            onClick={() => {
                              setSelectedMap(displayMap);
                              setEditMap(true);
                            }}
                          >
                            <h4>{displayMap.mapName} </h4>

                            <div className="info">
                              <p>{status[displayMap.status]}</p>
                              {displayMap.status === 0 ? (
                                <span
                                  className="material-symbols-outlined"
                                  onClick={(e) => deleteMap(displayMap, e)}
                                >
                                  delete
                                </span>
                              ) : (
                                <span
                                  className="material-symbols-outlined"
                                  onClick={(e) => deleteMap(displayMap, e)}
                                >
                                  move_item
                                </span>
                              )}
                              {/* <span className="material-symbols-outlined">
                                  more_vert
                                </span> */}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                  : displayMaps.map(
                      (displayMap, index) =>
                        status[displayMap.status] == filter && (
                          <li key={index}>
                            <div className="card">
                              <AspectRatio
                                ratio="3/4"
                                style={{ maxHeight: "200px" }}
                              >
                                <img
                                  src={displayMap.mapImage.preview}
                                  className="card-img-top"
                                  alt=""
                                />
                              </AspectRatio>
                              <div
                                className="card-body"
                                onClick={() => {
                                  setSelectedMap(displayMap);
                                  setEditMap(true);
                                }}
                              >
                                <h4>{displayMap.mapName}</h4>
                                <div className="info">
                                  <p>{status[displayMap.status]}</p>
                                  {displayMap.status === 0 ? (
                                    <span
                                      className="material-symbols-outlined"
                                      onClick={(e) => deleteMap(displayMap, e)}
                                    >
                                      delete
                                    </span>
                                  ) : (
                                    <span
                                      className="material-symbols-outlined"
                                      onClick={(e) => deleteMap(displayMap, e)}
                                    >
                                      move_item
                                    </span>
                                  )}
                                  {/* <span className="material-symbols-outlined">
                                  more_vert
                                </span> */}
                                </div>
                              </div>
                            </div>
                          </li>
                        )
                    )}
              </ul>
            </div>

            <div
              className="modal fade"
              id="newMapForm"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                      New Map
                    </h1>

                    <button type="button" data-bs-dismiss="modal">
                      {" "}
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  <form action="/submit">
                    <div className="mb-3">
                      <br />
                      <label className="form-label">Map Name</label>
                      <input
                        type="input"
                        className="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        onChange={(e) => setMapName(e.target.value)}
                        value={mapName}
                        required
                      />
                      <p id="formNote">
                        <FontAwesomeIcon icon={faInfoCircle} /> 30 characters
                        max
                      </p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Upload Map Photo</label>
                      <div {...getRootProps({ className: "drag-drop-img" })}>
                        <input
                          {...getInputProps({
                            accept: "image/jpeg, image/png",
                          })}
                        />
                        {isDragActive ? (
                          <p> Drop the files here...</p>
                        ) : (
                          <p>
                            {" "}
                            Drag and drop your image here or click to select
                            file
                          </p>
                        )}
                      </div>
                      <p id="formNote">
                        <FontAwesomeIcon icon={faInfoCircle} /> JPG/PNG
                      </p>
                      {mapImg.file && (
                        <div>
                          <img
                            src={mapImg.preview}
                            alt="Preview"
                            style={{
                              maxWidth: "200px",
                              maxHeight: "200px",
                              marginTop: "10px",
                            }}
                          />
                          <span
                            className="material-symbols-outlined"
                            onClick={() =>
                              setMapImg({
                                preview: "",
                                file: null, // Save the file itself if needed
                              })
                            }
                          >
                            close
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      disabled={mapName !== "" ? false : true}
                      data-bs-dismiss="modal"
                      onClick={(e) => {
                        e.preventDefault();
                        createMap(e, mapName, mapImg);
                        setMapName("");
                        setMapImg({ preview: "", file: null });
                      }}
                    >
                      Create
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Fade>
      )}
      {editMap && (
        <Fade>
          <div className="map-editor">
            <Topbar></Topbar>
            <div className="mheader">
              <h1>{selectedMap?.mapName}</h1>
              <div className="buttons">
                <button
                  className="add-friend-map"
                  data-bs-toggle="modal"
                  data-bs-target="#displayMapFriends"
                  onClick={() => setMember(true)}
                >
                  <span className="material-symbols-outlined">group</span>
                  Members
                </button>
                {selectedMap?.status === 0 && (
                  <button
                    className="add-friend-map"
                    data-bs-toggle="modal"
                    data-bs-target="#addFriendToMap"
                    onClick={() => setAddFriend(true)}
                  >
                    <span className="material-symbols-outlined">
                      person_add
                    </span>
                    Add Friend
                  </button>
                )}
                <button className="your-maps" onClick={() => setEditMap(false)}>
                  <span className="material-symbols-outlined">arrow_back</span>
                  Your Maps
                </button>
              </div>
            </div>
            <div className="map-editor-display">
              <MapDisplay mapId={selectedMap?.mapId ?? 0}></MapDisplay>
            </div>
            <div
              className="modal fade"
              id="addFriendToMap"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
              onClick={() => setAddFriend(false)}
            >
              <div
                className="modal-dialog"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                      Add Friend
                    </h1>
                    <button type="button" data-bs-dismiss="modal">
                      {" "}
                      <span
                        className="material-symbols-outlined"
                        onClick={() => setAddFriend(false)}
                      >
                        close
                      </span>
                    </button>
                  </div>
                  <div className="modal-body">
                    {addFriend && (
                      <MapFriends
                        mapId={selectedMap?.mapId ?? 0}
                        addFriend={true}
                      ></MapFriends>
                    )}
                  </div>
                  <div className="modal-footer"></div>
                </div>
              </div>
            </div>

            <div
              className="modal fade"
              id="displayMapFriends"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
              onClick={() => {
                setMember(false);
              }}
            >
              <div
                className="modal-dialog"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                      Members
                    </h1>
                    <button type="button" data-bs-dismiss="modal">
                      {" "}
                      <span
                        className="material-symbols-outlined"
                        onClick={() => setMember(false)}
                      >
                        close
                      </span>
                    </button>
                  </div>
                  <div className="modal-body">
                    {member && (
                      <MapFriends
                        mapId={selectedMap?.mapId ?? 0}
                        addFriend={false}
                        userStatus={selectedMap?.status}
                      ></MapFriends>
                    )}
                  </div>
                  <div className="modal-footer"></div>
                </div>
              </div>
            </div>
          </div>
        </Fade>
      )}
    </div>
  );
};
export default Dashboard;
