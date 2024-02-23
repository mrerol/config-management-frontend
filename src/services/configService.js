import axiosInstance from "../helpers/axiosInstance.js";

const ConfigService = {
    async list() {
        try {
            const response = await axiosInstance.get(`/get`);
            if (response.data.status === "OK") {
                return response.data.data;
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            throw error;
        }
    },
    async add(data) {
        try {
            const response = await axiosInstance.post(`/add`, data);
            if (response.data.status === "OK") {
                return response.data.data;
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            throw error;
        }
    },
    async update(id, data) {
        try {
            const response = await axiosInstance.put(`/update/${id}`, data);
            if (response.data.status === "OK") {
                return response.data.data;
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            throw error;
        }
    },
    async delete(id) {
        try {
            const response = await axiosInstance.delete(`/delete/${id}`);
            if (response.data.status === "OK") {
                return response.data.data;
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            throw error;
        }
    },
};

export default ConfigService;
