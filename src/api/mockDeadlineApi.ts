import { PriorityLevel } from '../types/deadline.types';
import type { Assignment, ApiResponse } from '../types/deadline.types';

const STORAGE_KEY = 'ptit_student_deadlines_v1';

const getFutureDateString = (daysOffset: number, hoursOffset: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(d.getHours() + hoursOffset, 0, 0, 0);
  return d.toISOString();
};

const getPastDateString = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(18, 0, 0, 0);
  return d.toISOString();
};

export const initialMockAssignments: Assignment[] = [
  {
    id: 'ASN-001',
    title: 'Xây dựng Web App Student Deadline Tracker (Redux + Compound Component)',
    subject: 'Lập trình Web nâng cao',
    dueDate: getFutureDateString(2, 4),
    priority: PriorityLevel.HIGH,
    completed: false,
    description: 'Áp dụng TypeScript nâng cao, Redux Toolkit, Custom Hook và Compound Component.',
    tags: ['React', 'Redux', 'TypeScript'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ASN-002',
    title: 'Bài tập lớn: Mô hình hóa hệ thống quản lý thư viện trường học',
    subject: 'Cơ sở dữ liệu',
    dueDate: getFutureDateString(0, 5),
    priority: PriorityLevel.HIGH,
    completed: false,
    description: 'Thiết kế biểu đồ ERD chuẩn hóa 3NF và viết các truy vấn SQL nâng cao.',
    tags: ['Database', 'SQL', 'ERD'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ASN-003',
    title: 'Cài đặt thuật toán Dijkstra và A* tìm đường đi ngắn nhất',
    subject: 'Cấu trúc dữ liệu & Giải thuật',
    dueDate: getPastDateString(1),
    priority: PriorityLevel.HIGH,
    completed: false,
    description: 'Viết bằng C++ / Python, tối ưu độ phức tạp sử dụng Min-Heap.',
    tags: ['Algorithms', 'Graphs', 'C++'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ASN-004',
    title: 'Thực hành Lab: Cấu hình mã hóa đối xứng AES & Bất đối xứng RSA',
    subject: 'An toàn & Bảo mật thông tin',
    dueDate: getFutureDateString(5),
    priority: PriorityLevel.MEDIUM,
    completed: true,
    completedAt: new Date().toISOString(),
    description: 'Hoàn thành bài thực hành giải mã chuỗi với OpenSSL và viết báo cáo PDF.',
    tags: ['Security', 'Cryptography'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ASN-005',
    title: 'Báo cáo thuyết trình: Tìm hiểu mạng nơ-ron tích chập CNN trong phân loại ảnh',
    subject: 'Trí tuệ nhân tạo',
    dueDate: getFutureDateString(7),
    priority: PriorityLevel.MEDIUM,
    completed: false,
    description: 'Soạn slide PowerPoint 20 trang và demo notebook phân loại tập ảnh CIFAR-10.',
    tags: ['AI', 'DeepLearning', 'CNN'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ASN-006',
    title: 'Bài tập tuần: Thiết kế bộ ALU 16-bit và mô phỏng trên Logisim',
    subject: 'Kiến trúc máy tính',
    dueDate: getPastDateString(3),
    priority: PriorityLevel.LOW,
    completed: true,
    completedAt: getPastDateString(3),
    description: 'Mô phỏng các khối cộng trừ, AND, OR, XOR và kiểm tra tràn số Overflow.',
    tags: ['Hardware', 'Logisim'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const fetchAssignmentsFromApi = async (
  options: { simulateError?: boolean; delayMs?: number } = {}
): Promise<ApiResponse<Assignment[]>> => {
  const { simulateError = false, delayMs = 600 } = options;

  await new Promise((resolve) => setTimeout(resolve, delayMs));

  if (simulateError) {
    throw new Error('Lỗi kết nối máy chủ máy chủ trường học (500 Internal Server Error)! Vui lòng thử lại.');
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  let assignments: Assignment[] = initialMockAssignments;

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        assignments = parsed;
      }
    } catch {
      assignments = initialMockAssignments;
    }
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockAssignments));
  }

  return {
    data: assignments,
    status: 200,
    message: 'Tải danh sách bài tập thành công!',
    timestamp: new Date().toISOString(),
  };
};

export const syncAssignmentsToStorage = (assignments: Assignment[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
  } catch (err) {
    console.error('Lỗi khi lưu bài tập vào localStorage:', err);
  }
};
