
import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../apiConfig/axios';
import LoadingScreen from '../ui/LoadingScreen';
import { useParams } from 'react-router-dom';

const ClubApplication = () => {
    const [loading, setLoading] = useState(true);
    const {ApplicationId}=useParams();
    console.log(ApplicationId);
    
// clubs
    // useEffect(()=>{
    //     const GetClubsList = async () => {
    //     try {
    //         const response = await axiosInstance.get('/api/clubs');
    //         steClubsList(response.data);
    //     } catch (err) {
    //         console.error(err.response?.status, err.response?.data || err.message);
    //         setUser(null);
    //     } finally {
    //         setLoading(false);
    //     }
    //     };
    //     GetClubsList();
    // },[])
    
if(loading){
    return <LoadingScreen/>
}
  return (
    <div style={{display:'flex'}}>
        club interview
    </div>
  );
};

export default ClubApplication;