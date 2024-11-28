import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { getNearbyUsers, User } from '../../store/userSlice';
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";

const EmergencyHome: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [geoDenied, setGeoDenied] = useState<boolean>(false); // Track if permission is denied
  const usersData = useSelector((state: RootState) => state.user.nearbyUsers.users);
  const loading = useSelector((state: RootState) => state.user.loading);
  const [users, setUsers] = useState<User[]>([])

  const totalPages = useSelector((state: RootState) => state.user.nearbyUsers.totalPages);
  const currentPage = useSelector((state: RootState) => state.user.nearbyUsers.currentPage);

// Fix for default marker icon issue
 ;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
   
  const fetchAddress = async (latitude: Number, longitude: Number) => {

    const apiKey = process.env.REACT_APP_GEOCODING_KEY;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        return data.results[0].formatted

      } else {
        return "No results found";
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          dispatch(getNearbyUsers({
            latitude, longitude,
            page: 0
          }));
          // const location = await fetchLocationOpenCage(latitude, longitude);
          // console.log(location)
          setError(null); // Reset error if location is fetched successfully
          setGeoDenied(false); // Reset denied flag
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            setError("You have denied geolocation access.");
            setGeoDenied(true); // Set flag to show retry option
          } else {
            setError("Unable to retrieve your location.");
          }
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };
 
  useEffect(() => {
    getUserLocation();
  }, []);
  useEffect(() => {
    const addAddress = async () => {
    const updatedUser=  usersData.length>0 && await Promise.all(usersData.map(async(userData)=>{
        let address = await fetchAddress(userData.location.coordinates[0], userData.location.coordinates[1]) 
           
         
          
         const updatedUser = { ...userData, address: address };
          return updatedUser
        }) )
        console.log(updatedUser)
        setUsers(updatedUser ? updatedUser : [])
        
    }
    addAddress()
  }, [usersData.length]);
  const handlePageChange = (page: number) => {
    dispatch(getNearbyUsers({
      latitude: location && location?.latitude ? location.latitude : Number(process.env.REACT_APP_LAT) , longitude:location && location?.longitude ? location.longitude : Number(process.env.REACT_APP_LONG),
      page: page
    }))
  };
  return (
    <div style={{ padding: "1rem", boxSizing: "border-box" }}>
      {/* <h1 style={{ textAlign: "center", fontSize: "1.5rem" }}>Map with Users</h1> */}

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "1rem",
          height: "70vh",
        }}
      >
        {/* Map Section */}
        <MapContainer
          style={{
            flex: "1 1 60%", // Takes 60% of width on large screens, adjusts on smaller
            minWidth: "300px",
            height: "100%",
            bottom: "2%"
          }}
          center={[51.505, -0.09]}
          zoom={13}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {users?.length>0 && users.map((user) => (
            <Marker
              key={user._id}
              position={[user.location.coordinates[0] , user.location.coordinates[1]]}

            >
              <Popup>{user.username}</Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* List Section */}
        <div
          style={{
            flex: "1 1 30%",
            minWidth: "300px",
            height: "100%",
            overflowY: "auto",
            backgroundColor: "#f8f8f8",
            borderRadius: "8px",
            padding: "1rem",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {geoDenied ?
            <div>
              <p>Geolocation permission was denied. Please allow access to get your location.</p>
              <button onClick={getUserLocation}>Try Again</button>
            </div>
            :
            <>
              <h2 style={{ marginBottom: "1rem", fontSize: "1.25rem" }}>Users</h2>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                { loading ? (
                     <p>Loading...</p>
                   ) : error ? (
                     <p>Error: {error}</p>
                   ) :users.length>0 && users.map((user) => (
                   <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
                   <h1>User Table</h1>
                   { (
                     <>
                       <table style={{ width: "100%", borderCollapse: "collapse" }}>
                         <thead>
                           <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
                             <th style={{ padding: "10px", border: "1px solid #ddd", color:"black" }}>Name</th>
                             <th style={{ padding: "10px", border: "1px solid #ddd", color:"black" }}>Location</th>
                             <th style={{ padding: "10px", border: "1px solid #ddd", color:"black" }}>Description</th>
                             <th style={{ padding: "10px", border: "1px solid #ddd", color:"black" }}>Phone</th>

                             {/* <th style={{ padding: "10px", border: "1px solid #ddd", color:"black" }}>Role</th> */}
                             <th style={{ padding: "10px", border: "1px solid #ddd" , color:"black"}}>Actions</th>
                           </tr>
                         </thead>
                         <tbody>
                           { users?.length>0 && users.map((user) => (
                             <tr key={user._id}>
                               <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                 {user.username}
                               </td>
                               <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                 {user.address}
                               </td>
                               <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                               {user.description}
                               </td>
                               <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                               {user.phoneNumber}
                               </td>
                               {/* <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                 <button
                                  //  onClick={() => handleEdit(user._id)}
                                   style={{
                                     marginRight: "10px",
                                     padding: "5px 10px",
                                     backgroundColor: "#4caf50",
                                     color: "#fff",
                                     border: "none",
                                     cursor: "pointer",
                                   }}
                                 >
                                  < FaEdit/> 
                                 </button>
                                 <button
                                  //  onClick={() => handleDelete(user._id)}
                                   style={{
                                     padding: "5px 10px",
                                     backgroundColor: "#f44336",
                                     color: "#fff",
                                     border: "none",
                                     cursor: "pointer",
                                   }}
                                 >
                                   < FaTrash/>
                                 </button>
                               </td> */}
                             </tr>
                           ))}
                         </tbody>
                       </table>
             
                       {/* Pagination */}
                       <div style={{ marginTop: "20px", textAlign: "center" }}>
                         {Array.from({ length:  totalPages }, (_, index) => (
                           <button
                             key={index + 1}
                             onClick={() => handlePageChange(index + 1)}
                             style={{
                               margin: "0 5px",
                               padding: "5px 10px",
                               backgroundColor: currentPage === index + 1 ? "#4caf50" : "#ddd",
                               color: currentPage === index + 1 ? "#fff" : "#000",
                               border: "none",
                               cursor: "pointer",
                             }}
                           >
                             {index + 1}
                           </button>
                         ))}
                       </div>
                     </>
                   )}
                 </div>
               ))}
              </ul>
            </>}
        </div>
      </div>
    </div>
  );
};

export default EmergencyHome;
