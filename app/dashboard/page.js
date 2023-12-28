import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
export default function Dashboard() {
  // get logged_in_user_type from backend
  const user_type = "teacher";


  return (
    <div>
      {user_type === "teacher" ? (
        <div className="h-screen w-screen bg-black grid-cols-4">

          <div
            className="card md:ml-10 md:mr-10 ml-5 mr-5 rounded-lg text-center inline-block bg-[#1E1E21] p-8"
          >
            <div className="flex justify-center">
              <FontAwesomeIcon icon="fa-regular fa-instagram" />
            </div>

            <div className="card-content">
              <h1 className="pr-10 pl-10">
                Classrooms
              </h1>
            </div>
          </div>

        </div>
      ) : (
        <div>Student Home Page</div>
      )}
    </div>
  );
}
