import React, { useState } from 'react';
import { PriorityLevel } from '../../types/deadline.types';
import type { CreateAssignmentDTO } from '../../types/deadline.types';
import {
  X,
  PlusCircle,
  BookOpen,
  Calendar,
  AlertCircle,
  FileText,
  Tag,
} from 'lucide-react';

interface CreateDeadlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateAssignmentDTO) => void;
  existingSubjects: string[];
}

export function CreateDeadlineModal({
  isOpen,
  onClose,
  onSubmit,
  existingSubjects,
}: CreateDeadlineModalProps) {
  const getDefaultDateTime = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    d.setHours(23, 59, 0, 0);
    return d.toISOString().slice(0, 16);
  };

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [dueDate, setDueDate] = useState(getDefaultDateTime());
  const [priority, setPriority] = useState<PriorityLevel>(PriorityLevel.MEDIUM);
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSubject = subject === '__NEW__' ? customSubject.trim() : subject.trim();

    if (!finalSubject) {
      setErrorMessage('Vui lòng chọn hoặc nhập tên môn học!');
      return;
    }

    if (!title.trim()) {
      setErrorMessage('Vui lòng nhập tên bài tập!');
      return;
    }

    if (!dueDate) {
      setErrorMessage('Vui lòng chọn ngày giờ hạn nộp!');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const dto: CreateAssignmentDTO = {
      title: title.trim(),
      subject: finalSubject,
      dueDate: new Date(dueDate).toISOString(),
      priority,
      description: description.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
    };

    onSubmit(dto);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setTitle('');
    setSubject('');
    setCustomSubject('');
    setDueDate(getDefaultDateTime());
    setPriority(PriorityLevel.MEDIUM);
    setDescription('');
    setTagsInput('');
    setErrorMessage('');
  };

  const defaultSubjectsList = Array.from(
    new Set([
      'Lập trình Web nâng cao',
      'Cơ sở dữ liệu',
      'Cấu trúc dữ liệu & Giải thuật',
      'Trí tuệ nhân tạo',
      'An toàn & Bảo mật thông tin',
      'Kiến trúc máy tính',
      'Lập trình hướng đối tượng',
      ...existingSubjects,
    ])
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <PlusCircle size={22} />
            </div>
            <div>
              <h3>Thêm bài tập / Deadline mới</h3>
              <p>Điền thông tin bài tập để hệ thống tự động theo dõi hạn nộp</p>
            </div>
          </div>
          <button
            type="button"
            className="btn-close-modal"
            onClick={onClose}
            title="Đóng cửa sổ thêm bài tập (Hủy)"
            aria-label="Đóng cửa sổ"
          >
            <X size={20} />
          </button>
        </div>

        {errorMessage && (
          <div className="modal-alert-error">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">
              <BookOpen size={15} /> Môn học *
            </label>
            <select
              className="form-input"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setErrorMessage('');
              }}
              required
            >
              <option value="">-- Chọn môn học --</option>
              {defaultSubjectsList.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
              <option value="__NEW__">➕ Nhập môn học mới...</option>
            </select>
          </div>

          {subject === '__NEW__' && (
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Nhập tên môn học mới (VD: Hệ điều hành)..."
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              <FileText size={15} /> Tên bài tập / Nhiệm vụ *
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="VD: Bài tập lớn: Thiết kế CSDL hệ thống..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrorMessage('');
              }}
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">
                <Calendar size={15} /> Hạn nộp (Ngày & Giờ) *
              </label>
              <input
                type="datetime-local"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <AlertCircle size={15} /> Mức độ ưu tiên *
              </label>
              <div className="priority-toggle-group">
                <button
                  type="button"
                  className={`priority-btn priority-btn-high ${priority === PriorityLevel.HIGH ? 'selected' : ''}`}
                  onClick={() => setPriority(PriorityLevel.HIGH)}
                >
                  Cao
                </button>
                <button
                  type="button"
                  className={`priority-btn priority-btn-medium ${priority === PriorityLevel.MEDIUM ? 'selected' : ''}`}
                  onClick={() => setPriority(PriorityLevel.MEDIUM)}
                >
                  Trung bình
                </button>
                <button
                  type="button"
                  className={`priority-btn priority-btn-low ${priority === PriorityLevel.LOW ? 'selected' : ''}`}
                  onClick={() => setPriority(PriorityLevel.LOW)}
                >
                  Thấp
                </button>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <FileText size={15} /> Ghi chú & Yêu cầu đề bài (tùy chọn)
            </label>
            <textarea
              className="form-input form-textarea"
              rows={3}
              placeholder="Ghi chú thêm: Yêu cầu nộp file zip, code trên GitHub, slide thuyết trình..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Tag size={15} /> Phân loại Tags (cách nhau bằng dấu phẩy)
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="VD: BTL, Báo cáo, React, C++"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy bỏ
            </button>
            <button type="submit" className="btn-submit">
              <PlusCircle size={16} /> Lưu bài tập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
