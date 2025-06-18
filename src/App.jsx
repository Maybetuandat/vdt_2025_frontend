import React, { useState, useEffect } from 'react';
import './App.css';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Add Modal Component
function AddModal({ onSave, onClose }) {
    const [formData, setFormData] = useState({
        fullName: '',
        birthDate: '',
        schoolCategory: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>➕ Thêm sinh viên mới</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Họ và tên:</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Ngày sinh:</label>
                        <input
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Trường:</label>
                        <input
                            type="text"
                            name="schoolCategory"
                            value={formData.schoolCategory}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit" className="btn btn-primary">
                            💾 Thêm sinh viên
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
function EditModal({ student, onSave, onClose }) {
    const [formData, setFormData] = useState({
        id: student.id,
        fullName: student.fullName,
        birthDate: student.birthDate,
        schoolCategory: student.schoolCategory
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>✏️ Chỉnh sửa thông tin sinh viên</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Họ và tên:</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Ngày sinh:</label>
                        <input
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Trường:</label>
                        <input
                            type="text"
                            name="schoolCategory"
                            value={formData.schoolCategory}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit" className="btn btn-primary">
                            💾 Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Delete Confirmation Modal Component
function DeleteModal({ student, onConfirm, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
                <div className="icon">⚠️</div>
                <h3>Xác nhận xóa</h3>
                <p>
                    Bạn có chắc chắn muốn xóa sinh viên <strong>{student.fullName}</strong>?
                    <br />
                    Hành động này không thể hoàn tác.
                </p>
                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Hủy
                    </button>
                    <button className="btn btn-delete" onClick={onConfirm}>
                        🗑️ Xóa
                    </button>
                </div>
            </div>
        </div>
    );
}

// Main StudentManagement Component
function StudentManagement() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);

    // Fetch students from API
    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_BASE_URL);
            console.log('Fetching students from:', API_BASE_URL);
            console.log('Response status:', response);
            if (response.ok) {
                const data = await response.json();
                // Sort data by ID in ascending order
                const sortedData = data.sort((a, b) => a.id - b.id);
                setStudents(sortedData);
            } else {
                console.error('Failed to fetch students');
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load students on component mount
    useEffect(() => {
        fetchStudents();
    }, []);

    // Filter students based on search term
    const filteredStudents = students.filter(student => 
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.schoolCategory.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle add student
    const handleAdd = () => {
        setAddModalOpen(true);
    };

    // Handle edit student
    const handleEdit = (student) => {
        setCurrentStudent({...student});
        setEditModalOpen(true);
    };

    // Handle delete student
    const handleDelete = (student) => {
        setCurrentStudent(student);
        setDeleteModalOpen(true);
    };

    // Add new student
    const addStudent = async (studentData) => {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData),
            });

            if (response.ok) {
                await fetchStudents(); // Refresh data
                setAddModalOpen(false);
            } else {
                alert('Lỗi khi thêm sinh viên');
            }
        } catch (error) {
            console.error('Error adding student:', error);
            alert('Lỗi khi thêm sinh viên');
        }
    };

    // Save student (edit)
    const saveStudent = async (studentData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${studentData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData),
            });

            if (response.ok) {
                await fetchStudents(); // Refresh data
                setEditModalOpen(false);
                setCurrentStudent(null);
            } else {
                alert('Lỗi khi cập nhật sinh viên');
            }
        } catch (error) {
            console.error('Error updating student:', error);
            alert('Lỗi khi cập nhật sinh viên');
        }
    };

    // Delete student
    const deleteStudent = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/${currentStudent.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchStudents(); // Refresh data
                setDeleteModalOpen(false);
                setCurrentStudent(null);
            } else {
                alert('Lỗi khi xóa sinh viên');
            }
        } catch (error) {
            console.error('Error deleting student:', error);
            alert('Lỗi khi xóa sinh viên');
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div className="container">
            <div className="header">
                <h1>🎓 Student Management System</h1>
                <p>Quản lý thông tin sinh viên một cách hiện đại và hiệu quả</p>
            </div>

            <div className="content">
                <div className="controls">
                    <div className="search-box">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên hoặc trường..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="add-btn" onClick={handleAdd}>
                        ➕ Thêm sinh viên
                    </button>
                </div>

                {loading ? (
                    <div className="loading">
                        <div className="loading-spinner"></div>
                        <p>Đang tải dữ liệu...</p>
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="no-data">
                        <div className="no-data-icon">📚</div>
                        <h3>Không có dữ liệu</h3>
                        <p>Không tìm thấy sinh viên nào phù hợp với từ khóa tìm kiếm.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Họ và tên</th>
                                    <th>Ngày sinh</th>
                                    <th>Trường</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student) => (
                                    <tr key={student.id}>
                                        <td>{student.id}</td>
                                        <td className="student-name">{student.fullName}</td>
                                        <td className="birth-date">{formatDate(student.birthDate)}</td>
                                        <td className="school-category" title={student.schoolCategory}>
                                            {student.schoolCategory}
                                        </td>
                                        <td>
                                            <div className="actions">
                                                <button 
                                                    className="btn btn-edit"
                                                    onClick={() => handleEdit(student)}
                                                >
                                                    ✏️ Sửa
                                                </button>
                                                <button 
                                                    className="btn btn-delete"
                                                    onClick={() => handleDelete(student)}
                                                >
                                                    🗑️ Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Modal */}
            {addModalOpen && (
                <AddModal
                    onSave={addStudent}
                    onClose={() => {
                        setAddModalOpen(false);
                    }}
                />
            )}

            {/* Edit Modal */}
            {editModalOpen && (
                <EditModal
                    student={currentStudent}
                    onSave={saveStudent}
                    onClose={() => {
                        setEditModalOpen(false);
                        setCurrentStudent(null);
                    }}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <DeleteModal
                    student={currentStudent}
                    onConfirm={deleteStudent}
                    onClose={() => {
                        setDeleteModalOpen(false);
                        setCurrentStudent(null);
                    }}
                />
            )}
        </div>
    );
}

export default StudentManagement;