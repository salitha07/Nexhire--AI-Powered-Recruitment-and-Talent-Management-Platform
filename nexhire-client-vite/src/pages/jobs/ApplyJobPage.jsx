// src/pages/jobs/ApplyJobPage.jsx

import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from '../../components/Navbar';

import { getJobById } from '../../services/jobsApi';
import {
  applyToJob,
  uploadResume
} from '../../services/applicationsApi';



const styles = {

  page:{
    minHeight:'100vh',
    background:'#f8fafc',
    fontFamily:"'Segoe UI', sans-serif",
    color:'#1e293b'
  },


  container:{
    maxWidth:'850px',
    margin:'40px auto',
    padding:'0 20px'
  },


  card:{
    background:'#ffffff',
    borderRadius:'14px',
    padding:'35px',
    boxShadow:'0 4px 15px rgba(0,0,0,0.08)'
  },


  back:{
    textDecoration:'none',
    color:'#2563eb',
    fontSize:'14px'
  },


  title:{
    fontSize:'30px',
    fontWeight:'800',
    marginTop:'25px'
  },


  subtitle:{
    color:'#64748b',
    marginBottom:'30px'
  },


  grid:{
    display:'grid',
    gridTemplateColumns:'1fr 1fr',
    gap:'20px'
  },


  input:{
    width:'100%',
    padding:'12px',
    borderRadius:'8px',
    border:'1px solid #cbd5e1',
    boxSizing:'border-box'
  },


  textarea:{
    width:'100%',
    minHeight:'120px',
    padding:'12px',
    borderRadius:'8px',
    border:'1px solid #cbd5e1',
    resize:'vertical',
    boxSizing:'border-box'
  },


  label:{
    fontWeight:'600',
    fontSize:'14px',
    marginBottom:'6px',
    display:'block'
  },


  field:{
    marginBottom:'20px'
  },


  button:{
    width:'100%',
    padding:'15px',
    border:'none',
    borderRadius:'10px',
    background:
      'linear-gradient(135deg,#2563eb,#3b82f6)',
    color:'white',
    fontWeight:'700',
    cursor:'pointer',
    fontSize:'16px'
  },


  cancel:{
    width:'100%',
    marginTop:'12px',
    padding:'13px',
    border:'none',
    borderRadius:'10px',
    background:'#f1f5f9',
    cursor:'pointer'
  }

};





function ApplyJobPage(){


  const {id}=useParams();

  const navigate=useNavigate();



  const [job,setJob]=useState(null);

  const [loading,setLoading]=useState(true);

  const [submitting,setSubmitting]=useState(false);


  const [resumeFile, setResumeFile] = useState(null);


  const [form,setForm]=useState({

    education:'',
    experienceYears:0,
    skills:'',
    githubUrl:'',
    linkedinUrl:'',
    portfolioUrl:'',
    resumePath:'',
    whySuitable:'',
    coverLetter:''

  });





  useEffect(()=>{


    const loadJob=async()=>{


      try{

        const data=
          await getJobById(id);

        setJob(data);


      }
      catch{

        toast.error(
          "Unable to load job details."
        );

      }
      finally{

        setLoading(false);

      }

    };


    loadJob();


  },[id]);







  const handleChange=(e)=>{


    const {
      name,
      value
    }=e.target;



    setForm({

      ...form,

      [name]:value

    });


  };







  const handleSubmit=async(e)=>{


    e.preventDefault();



    if(!form.education){

      toast.error(
        "Education is required."
      );

      return;

    }



    if(!form.skills){

      toast.error(
        "Skills are required."
      );

      return;

    }



    setSubmitting(true);

    let resumePath = "";

if (resumeFile) {
  const uploadResult = await uploadResume(resumeFile);
  resumePath = uploadResult.fileUrl;
}



    try{


      await applyToJob({

  jobId: Number(id),

  ...form,

  resumePath,

  experienceYears: Number(form.experienceYears)

});



      toast.success(
        "Application submitted successfully!"
      );



      setTimeout(()=>{


        navigate(
          "/applications/my"
        );


      },1500);




    }
    catch(err){


      toast.error(

        err.response?.data?.message ||

        "Application failed."

      );


    }
    finally{


      setSubmitting(false);


    }


  };








  if(loading){


    return (

      <div style={styles.page}>

        <Navbar/>

        <p style={{
          textAlign:'center',
          marginTop:'50px'
        }}>

          Loading...

        </p>


      </div>

    );

  }








  return (

    <div style={styles.page}>


      <ToastContainer/>

      <Navbar/>




      <div style={styles.container}>


        <Link
          to={`/jobs/${id}`}
          style={styles.back}
        >

          ← Back to Job

        </Link>





        <div style={styles.card}>


          <h1 style={styles.title}>

            Apply for {job?.title}

          </h1>



          <p style={styles.subtitle}>

            📍 {job?.location}
            {" | "}
            {job?.type}

          </p>





          <form onSubmit={handleSubmit}>



            <div style={styles.grid}>


              <div style={styles.field}>


                <label style={styles.label}>
                  Education
                </label>


                <input

                  style={styles.input}

                  name="education"

                  value={form.education}

                  onChange={handleChange}

                  placeholder="BSc Computer Science"

                />


              </div>






              <div style={styles.field}>


                <label style={styles.label}>
                  Experience Years
                </label>


                <input

                  type="number"

                  min="0"

                  style={styles.input}

                  name="experienceYears"

                  value={form.experienceYears}

                  onChange={handleChange}

                />


              </div>


            </div>






            <div style={styles.field}>


              <label style={styles.label}>
                Skills
              </label>


              <textarea

                style={styles.textarea}

                name="skills"

                value={form.skills}

                onChange={handleChange}

                placeholder="React, C#, SQL, ASP.NET..."

              />


            </div>








            <div style={styles.grid}>


              <div style={styles.field}>


                <label style={styles.label}>
                  GitHub URL
                </label>


                <input

                  style={styles.input}

                  name="githubUrl"

                  value={form.githubUrl}

                  onChange={handleChange}

                />


              </div>





              <div style={styles.field}>


                <label style={styles.label}>
                  LinkedIn URL
                </label>


                <input

                  style={styles.input}

                  name="linkedinUrl"

                  value={form.linkedinUrl}

                  onChange={handleChange}

                />


              </div>


            </div>







            <div style={styles.field}>


              <label style={styles.label}>
                Portfolio URL
              </label>


              <input

                style={styles.input}

                name="portfolioUrl"

                value={form.portfolioUrl}

                onChange={handleChange}

              />


            </div>








            <div style={styles.field}>
  <label style={styles.label}>
    Resume (PDF)
  </label>

  <input
    type="file"
    accept=".pdf"
    onChange={(e) => setResumeFile(e.target.files[0])}
  />
</div>








            <div style={styles.field}>


              <label style={styles.label}>
                Why are you suitable?
              </label>


              <textarea

                style={styles.textarea}

                name="whySuitable"

                value={form.whySuitable}

                onChange={handleChange}

              />


            </div>







            <div style={styles.field}>


              <label style={styles.label}>
                Cover Letter
              </label>


              <textarea

                style={styles.textarea}

                name="coverLetter"

                value={form.coverLetter}

                onChange={handleChange}

              />


            </div>








            <button

              style={styles.button}

              disabled={submitting}

            >

              {
                submitting
                ?
                "Submitting..."
                :
                "Submit Application"
              }


            </button>






            <button

              type="button"

              style={styles.cancel}

              onClick={()=>navigate(`/jobs/${id}`)}

            >

              Cancel

            </button>




          </form>



        </div>



      </div>



    </div>

  );


}



export default ApplyJobPage;