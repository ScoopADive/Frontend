// 폼 입력 핸들러
export const handleFormChange = (setFormData) => (e) => {
  const { name, value } = e.target; 
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

// 공통 에러 메시지 추출
export const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.detail ||
    error?.message ||
    "예기치 못한 오류가 발생했습니다."
  );
};
