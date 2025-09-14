import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NotificationSettings } from '@/types/notification';
import { notificationService } from '@/services/notification';

interface NotificationSettingsFormProps {
  initialSettings: NotificationSettings;
  onSave: () => void;
}

export function NotificationSettingsForm({ initialSettings, onSave }: NotificationSettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { userId, ...settingsData } = settings;
      await notificationService.updateSettings(userId, settingsData);
      onSave();
    } catch (error) {
      console.error('Error saving notification settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSetting = (key: string) => {
    if (key === 'emailEnabled' || key === 'pushEnabled') {
      setSettings(prev => ({
        ...prev,
        [key]: !prev[key],
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [key]: !prev.preferences[key as keyof typeof prev.preferences],
        },
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Cài đặt thông báo</h3>
        
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.emailEnabled}
              onChange={() => toggleSetting('emailEnabled')}
              className="w-4 h-4"
            />
            <span>Nhận thông báo qua email</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.pushEnabled}
              onChange={() => toggleSetting('pushEnabled')}
              className="w-4 h-4"
            />
            <span>Nhận thông báo trên trình duyệt</span>
          </label>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Loại thông báo</h4>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.preferences.thongBaoKhoaHoc}
              onChange={() => toggleSetting('thongBaoKhoaHoc')}
              className="w-4 h-4"
            />
            <span>Thông báo khóa học</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.preferences.thongBaoBaiTap}
              onChange={() => toggleSetting('thongBaoBaiTap')}
              className="w-4 h-4"
            />
            <span>Thông báo bài tập</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.preferences.thongBaoKetQua}
              onChange={() => toggleSetting('thongBaoKetQua')}
              className="w-4 h-4"
            />
            <span>Thông báo kết quả</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.preferences.thongBaoHoatDong}
              onChange={() => toggleSetting('thongBaoHoatDong')}
              className="w-4 h-4"
            />
            <span>Thông báo hoạt động</span>
          </label>
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={isSaving}
      >
        {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
      </Button>
    </div>
  );
}