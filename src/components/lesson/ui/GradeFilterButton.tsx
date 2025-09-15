import Button from '@/components/ui/button';
interface GradeFilterButtonProps {
  grade: number;
  isSelected: boolean;
  onClick: () => void;
}

export function GradeFilterButton({ grade, isSelected, onClick }: GradeFilterButtonProps) {
  return (
    <Button 
      onClick={onClick}
      variant="ghost"
      className={`flex items-center justify-between px-3 py-2 text-sm w-full rounded transition-colors ${
        isSelected 
          ? 'bg-white bg-opacity-20 text-white' 
          : 'text-blue-200 hover:bg-white hover:bg-opacity-10 hover:text-white'
      }`}
    >
      <span>Khối {grade}</span>
      {isSelected && (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
        </svg>
      )}
    </Button>
  );
}
