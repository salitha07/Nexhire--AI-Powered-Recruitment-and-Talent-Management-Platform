// src/components/AIResultCard.jsx

function AIResultCard({ result }) {

    if (!result) return null;


    const score = result.matchScore || 0;


    const getRecommendationStyle = () => {

        if(result.recommendation?.includes("Strong Hire"))
        {
            return {
                background:"#dcfce7",
                color:"#166534"
            };
        }


        if(result.recommendation?.includes("Hire"))
        {
            return {
                background:"#dbeafe",
                color:"#1e40af"
            };
        }


        if(result.recommendation?.includes("Maybe"))
        {
            return {
                background:"#fef3c7",
                color:"#92400e"
            };
        }


        return {
            background:"#fee2e2",
            color:"#991b1b"
        };

    };



    const skills =
        result.extractedSkills
        ?
        result.extractedSkills
            .split(",")
            .map(s=>s.trim())
        :
        [];



    return (

        <div
            style={{
                background:"white",
                borderRadius:"12px",
                padding:"25px",
                boxShadow:"0 3px 15px rgba(0,0,0,.08)",
                marginTop:"20px"
            }}
        >


            <h3>
                🤖 AI Candidate Analysis
            </h3>



            {/* SCORE */}

            <div
                style={{
                    marginTop:"20px"
                }}
            >

                <div
                    style={{
                        display:"flex",
                        justifyContent:"space-between",
                        marginBottom:"8px",
                        fontWeight:"700"
                    }}
                >

                    <span>
                        Match Score
                    </span>


                    <span>
                        {score}%
                    </span>


                </div>



                <div
                    style={{
                        height:"12px",
                        background:"#e2e8f0",
                        borderRadius:"10px",
                        overflow:"hidden"
                    }}
                >

                    <div
                        style={{
                            width:`${score}%`,
                            height:"100%",
                            background:
                            score >= 80
                            ?
                            "#16a34a"
                            :
                            score >= 60
                            ?
                            "#2563eb"
                            :
                            "#f59e0b"
                        }}
                    />

                </div>


            </div>





            {/* Recommendation */}

            <div
                style={{
                    marginTop:"20px"
                }}
            >

                <h4>
                    Recommendation
                </h4>


                <span
                    style={{
                        padding:"8px 14px",
                        borderRadius:"20px",
                        fontWeight:"700",
                        fontSize:"14px",
                        ...getRecommendationStyle()
                    }}
                >

                    {result.recommendation}

                </span>


            </div>







            {/* Skills */}

            {
                skills.length > 0 &&

                <div
                    style={{
                        marginTop:"20px"
                    }}
                >

                    <h4>
                        Extracted Skills
                    </h4>


                    <div
                        style={{
                            display:"flex",
                            gap:"8px",
                            flexWrap:"wrap"
                        }}
                    >

                    {
                        skills.map(
                            (skill,index)=>(

                                <span
                                    key={index}
                                    style={{
                                        background:"#f1f5f9",
                                        padding:"6px 12px",
                                        borderRadius:"20px",
                                        fontSize:"13px"
                                    }}
                                >

                                    {skill}

                                </span>

                            )
                        )
                    }

                    </div>


                </div>

            }





            <small
                style={{
                    display:"block",
                    marginTop:"20px",
                    color:"#64748b"
                }}
            >

                Generated:
                {" "}
                {
                    new Date(
                        result.createdAt
                    )
                    .toLocaleString()
                }

            </small>



        </div>

    );

}


export default AIResultCard;