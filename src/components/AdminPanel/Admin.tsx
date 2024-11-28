import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getUsers, updateUserById, deleteUserById, User, getUserById, removeSelectedUser, createUser } from '../../store/userSlice';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchAddress } from "../../utils/location";


interface FormData {
  title: string;
  username: string;
  description: string;
  phoneNumber: string;
  role: string;

}


const AdminPanel: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    username: '',
    description: '',
    phoneNumber: '',
    role: '',

  });
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.user.loading);
  const error = useSelector((state: RootState) => state.user.error);
  const usersData = useSelector((state: RootState) => state.user.allUsers.users);
  const [users, setUsers] = useState<User[]>([])
  const totalPages = useSelector((state: RootState) => state.user.allUsers.totalPages);
  const currentPage = useSelector((state: RootState) => state.user.allUsers.currentPage);
  const selectedUser = useSelector((state: RootState) => state.user.selectedUser);

  const [errors, setErrors] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // Handle form data changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  useEffect(() => {
    setFormData({
      title: selectedUser && selectedUser.title ? selectedUser.title : "",
      username: selectedUser && selectedUser.username ? selectedUser.username : "",
      description: selectedUser && selectedUser.description ? selectedUser.description : "",
      phoneNumber: selectedUser && selectedUser.phoneNumber ? selectedUser.phoneNumber : "",
      role: selectedUser && selectedUser.role ? selectedUser.role : "",

    })
  }, [selectedUser])
  // Validation function
  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.username) newErrors.name = 'Name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.phoneNumber) newErrors.phone = 'Phone is required';
    if (!formData.role) newErrors.role = 'Role is required';


    setErrors(newErrors);

    // If no errors, return true
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm() && selectedUser?._id) {
       
      dispatch(updateUserById({ id: selectedUser._id, user: formData }))
      // You can send the data to API or handle it further
      setIsModalOpen(false); // Close the modal after submission
    }

    if(validateForm() && !selectedUser) {
      dispatch(createUser({user: formData }))
    }
  };

  // Toggle modal visibility
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    dispatch(getUsers(1))
  }, [])
  useEffect(() => {
    const addAddress = async () => {
      const updatedUser = usersData.length > 0 && await Promise.all(usersData.map(async (userData) => {
        let address = await fetchAddress(userData.location.coordinates[0], userData.location.coordinates[1])
        const updatedUser = { ...userData, address: address };
        return updatedUser
      }))
      console.log(updatedUser)
      setUsers(updatedUser ? updatedUser : [])

    }
    addAddress()
  }, [usersData.length]);
  const handleEdit = (user: User) => {
    const id = user._id
    dispatch(getUserById({ id }))
    toggleModal()
    
  };
  const handleAddUser = () => {
   dispatch(removeSelectedUser())
    toggleModal()
  }
  const handleDelete = (id: string) => {
    dispatch(deleteUserById(`${id}`))
  };
  const handlePageChange = (page: number) => {
    dispatch(getUsers(page))
  };
  return (
    <>

      {!isModalOpen ? <ul style={{ listStyleType: "none", padding: 0 }}>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : users.length > 0 &&
        <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
          <h1>User Table</h1>
          {(
            <>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
                    <th style={{ padding: "10px", border: "1px solid #ddd", color: "black" }}>Name</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd", color: "black" }}>Title</th>

                    <th style={{ padding: "10px", border: "1px solid #ddd", color: "black" }}>Location</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd", color: "black" }}>Description</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd", color: "black" }}>Phone</th>

                    {/* <th style={{ padding: "10px", border: "1px solid #ddd", color:"black" }}>Role</th> */}
                    <th style={{ padding: "10px", border: "1px solid #ddd", color: "black" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.length > 0 && users.map((user) => (
                    <tr key={user._id}>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {user.username}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {user.title}
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
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        <button
                          onClick={() => handleEdit(user)}
                          style={{
                            marginRight: "10px",
                            padding: "5px 10px",
                            backgroundColor: "#4caf50",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          < FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "#f44336",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          < FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                {Array.from({ length: totalPages }, (_, index) => (
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
          <button type="submit" onClick={handleAddUser} style={{ marginTop: '20px' }}>
                  Add User
                </button>
        </div>
        }
      </ul> : (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '400px',
              position: 'relative',
            }}
          >
            {/* Close button */}
            <button
              onClick={toggleModal}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '20px',
              }}
            >
              &times;
            </button>

            <h2>User Form</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  style={{ width: '100%' }}
                />
                {errors.title && <p style={{ color: 'red' }}>{errors.title}</p>}
              </div>

              <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  style={{ width: '100%' }}
                />
                {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
              </div>

              <div>
                <label>Description:</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  style={{ width: '100%' }}
                />
                {errors.description && (
                  <p style={{ color: 'red' }}>{errors.description}</p>
                )}
              </div>

              <div>
                <label>Phone:</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  style={{ width: '100%' }}
                />
                {errors.phone && <p style={{ color: 'red' }}>{errors.phone}</p>}
              </div>

              <div>
                <label>Role:</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={{ width: '100%' }}
                />
                {errors.role && <p style={{ color: 'red' }}>{errors.role}</p>}
              </div>


              <div>
                <button type="submit" style={{ marginTop: '20px' }}>
                  {!selectedUser ? "Submit" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )
      }
    </>
  );
};

export default AdminPanel;
