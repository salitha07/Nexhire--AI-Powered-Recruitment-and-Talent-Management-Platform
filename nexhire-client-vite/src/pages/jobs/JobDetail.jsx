// src/pages/jobs/JobDetail.jsx

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import { getJobById } from '../../services/jobsApi';
import { getMyApplications } from '../../services/applicationsApi';

import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';



const styles = {

  page:{
    minHeight:'100vh',
    background:'#f8fafc',
    fontFamily:"'Segoe UI', sans-serif",
    color:'#1e293b'
  },


  hero:{
    background:
      'linear-gradient(135deg,#1e3a5f,#2563eb)',
    padding:'48px 80px',
    color:'white'
  },


  backLink:{
    color:'#dbeafe',
    textDecoration:'none',
    fontSize:'14px',
    display:'inline-block',
    marginBottom:'25px'
  },


  title:{
    fontSize:'36px',
    fontWeight:'800',
    marginBottom:'15px'
  },


  info:{
    display:'flex',
    gap:'20px',
    flexWrap:'wrap',
    color:'#dbeafe'
  },


  layout:{
    maxWidth:'1100px',
    margin:'auto',
    padding:'40px 80px',
    display:'grid',
    gridTemplateColumns:'1fr 330px',
    gap:'30px'
  },


  card:{
    background:'white',
    padding:'30px',
    borderRadius:'12px',
    boxShadow:'0 2px 12px rgba(0,0,0,.06)',
    marginBottom:'25px'
  },


  sectionTitle:{
    fontWeight:'700',
    fontSize:'18px',
    marginBottom:'15px'
  },


  text:{
    color:'#475569',
    lineHeight:'1.8',
    whiteSpace:'pre-wrap'
  },


  button:{
    width:'100%',
    padding:'14px',
    border:'none',
    borderRadius:'10px',
    background:
      'linear-gradient(135deg,#2563eb,#3b82f6)',
    color:'white',
    fontWeight:'700',
    cursor:'pointer',
    fontSize:'15px'
  },


  applied:{
    background:'#dcfce7',
    color:'#166534',
    padding:'14px',
    borderRadius:'10px',
    textAlign:'center',
    fontWeight:'700'
  },


  loading:{
    minHeight:'400px',
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  }

};



const badgeColors={

  "full-time":{
    background:'#dbeafe',
    color:'#1e40af'
  },

  "part-time":{
    background:'#fef3c7',
    color:'#92400e'
  },

  "remote":{
    background:'#dcfce7',
    color:'#166534'
  },

  "hybrid":{
    background:'#ede9fe',
    color:'#5b21b6'
  }

};



function formatDate(date){

  return new Date(date)
    .toLocaleDateString(
      'en-US',
      {
        year:'numeric',
        month:'long',
        day:'numeric'
      }
    );

}



function JobDetail(){


  const {id}=useParams();

  const navigate=useNavigate();


  const {
    user,
    isAuthenticated
  }=useAuth();



  const [job,setJob]=useState(null);

  const [loading,setLoading]=useState(true);

  const [error,setError]=useState(null);


  const [hasApplied,setHasApplied]=useState(false);

  const [checking,setChecking]=useState(false);



  useEffect(()=>{


    const loadJob=async()=>{


      try{

        const data=
          await getJobById(id);

        setJob(data);


      }
      catch{

        setError(
          "Failed to load job."
        );

      }
      finally{

        setLoading(false);

      }

    };


    loadJob();


  },[id]);



  useEffect(()=>{


    const check=async()=>{


      if(
        !isAuthenticated ||
        user?.role!=="candidate"
      )
        return;



      try{

        setChecking(true);


        const apps=
          await getMyApplications();



        const exists=
          apps.some(
            a =>
            String(a.jobId)
            ===
            String(id)
          );



        setHasApplied(exists);


      }
      catch{


      }
      finally{

        setChecking(false);

      }

    };


    check();


  },[
    id,
    user,
    isAuthenticated
  ]);



  if(loading){

    return (

      <div style={styles.page}>

        <Navbar/>

        <div style={styles.loading}>
          Loading...
        </div>

      </div>

    );

  }



  if(error || !job){

    return (

      <div style={styles.page}>

        <Navbar/>

        <div style={styles.card}>

          {error || "Job not found"}

          <br/>

          <Link to="/jobs">
            Back
          </Link>

        </div>

      </div>

    );

  }



  const badge =
    badgeColors[
      job.type?.toLowerCase()
    ] || {};
      return (

    <div style={styles.page}>


      <Navbar />



      {/* HERO */}

      <div style={styles.hero}>


        <Link
          to="/jobs"
          style={styles.backLink}
        >

          ← Back to Jobs

        </Link>



        <div>

          <span
            style={{
              padding:'5px 12px',
              borderRadius:'20px',
              fontSize:'12px',
              fontWeight:'700',
              ...badge
            }}
          >

            {job.type}

          </span>



          {
            job.isActive &&

            <span
              style={{
                marginLeft:'10px',
                padding:'5px 12px',
                borderRadius:'20px',
                background:'#dcfce7',
                color:'#166534',
                fontSize:'12px',
                fontWeight:'700'
              }}
            >

              ✓ Actively Hiring

            </span>

          }


        </div>




        <h1 style={styles.title}>

          {job.title}

        </h1>




        <div style={styles.info}>

          <span>
            📍 {job.location}
          </span>


          {
            job.salaryRange &&
            <span>
              💰 {job.salaryRange}
            </span>
          }


          <span>
            👤 {job.postedByFullName || job.postedByEmail}
          </span>


          <span>
            📅 {formatDate(job.createdAt)}
          </span>


        </div>


      </div>






      {/* CONTENT */}


      <div style={styles.layout}>



        {/* LEFT SIDE */}


        <div>


          <div style={styles.card}>


            <div style={styles.sectionTitle}>
              Job Description
            </div>



            <p style={styles.text}>

              {job.description}

            </p>


          </div>





          <div style={styles.card}>


            <div style={styles.sectionTitle}>
              Requirements
            </div>



            <p style={styles.text}>

              {job.requirements}

            </p>


          </div>



        </div>







        {/* RIGHT SIDE */}


        <div>



          <div style={styles.card}>


            <h3>

              Interested in this role?

            </h3>



            <p style={{
              color:'#64748b',
              fontSize:'14px'
            }}>

              Submit your application and let the recruiter review your profile.

            </p>





            {
              !isAuthenticated &&

              <Link

                to="/login"

                style={{
                  ...styles.button,
                  display:'block',
                  textAlign:'center',
                  textDecoration:'none'
                }}

              >

                Login to Apply

              </Link>

            }






            {
              isAuthenticated &&
              user?.role==="candidate" &&

              (

                hasApplied ?

                (

                  <div style={styles.applied}>

                    ✓ Application Submitted

                  </div>

                )

                :

                (

                  <button

                    style={styles.button}

                    disabled={checking}

                    onClick={()=>{

                      navigate(
                        `/jobs/${id}/apply`
                      );

                    }}

                  >

                    {
                      checking
                      ?
                      "Checking..."
                      :
                      "Apply Now →"
                    }


                  </button>


                )

              )

            }






            {
              isAuthenticated &&
              user?.role!=="candidate" &&

              (

                <p>

                  Only candidates can apply.

                </p>

              )

            }



          </div>








          <div style={styles.card}>


            <h3>

              Job Details

            </h3>



            <p>

              <b>Type:</b> {job.type}

            </p>


            <p>

              <b>Location:</b> {job.location}

            </p>


            <p>

              <b>Salary:</b>

              {
                job.salaryRange ||
                " Not specified"
              }

            </p>


            <p>

              <b>Status:</b>

              {
                job.isActive
                ?
                " Active"
                :
                " Closed"
              }

            </p>


          </div>








          <div style={styles.card}>


            <h3>

              Posted By

            </h3>


            <p>

              {job.postedByFullName || "Recruiter"}

            </p>


            <p>

              {job.postedByEmail}

            </p>


          </div>




        </div>



      </div>



    </div>

  );

}


export default JobDetail;