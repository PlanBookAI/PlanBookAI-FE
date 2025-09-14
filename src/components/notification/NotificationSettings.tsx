import { Button } from "@/components/ui/button";

interface NotificationSettingsProps {
  settings: {
    emailEnabled: boolean;
    pushEnabled: boolean;
    preferences: {
      thongBaoKhoaHoc: boolean;
      thongBaoBaiTap: boolean;
      thongBaoKetQua: boolean;
      thongBaoHoatDong: boolean;
    }
  };
  onSave: (settings: any) => void;
}

export function NotificationSettings({ settings, onSave }: NotificationSettingsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Cài đặt thông báo</h2>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Kênh nhận thông báo</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
                checked={settings.emailEnabled}
                onChange={(e) => onSave({ ...settings, emailEnabled: e.target.checked })}
              />
              <span className="text-gray-700">Email</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
                checked={settings.pushEnabled}
                onChange={(e) => onSave({ ...settings, pushEnabled: e.target.checked })}
              />
              <span className="text-gray-700">Thông báo đẩy</span>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Loại thông báo</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
                checked={settings.preferences.thongBaoKhoaHoc}
                onChange={(e) => onSave({
                  ...settings,
                  preferences: {
                    ...settings.preferences,
                    thongBaoKhoaHoc: e.target.checked
                  }
                })}
              />
              <span className="text-gray-700">Thông báo khóa học</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
                checked={settings.preferences.thongBaoBaiTap}
                onChange={(e) => onSave({
                  ...settings,
                  preferences: {
                    ...settings.preferences,
                    thongBaoBaiTap: e.target.checked
                  }
                })}
              />
              <span className="text-gray-700">Thông báo bài tập</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
                checked={settings.preferences.thongBaoKetQua}
                onChange={(e) => onSave({
                  ...settings,
                  preferences: {
                    ...settings.preferences,
                    thongBaoKetQua: e.target.checked
                  }
                })}
              />
              <span className="text-gray-700">Thông báo kết quả</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
                checked={settings.preferences.thongBaoHoatDong}
                onChange={(e) => onSave({
                  ...settings,
                  preferences: {
                    ...settings.preferences,
                    thongBaoHoatDong: e.target.checked
                  }
                })}
              />
              <span className="text-gray-700">Thông báo hoạt động</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}