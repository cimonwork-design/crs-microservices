import type { Course } from '@/types/course';
import { BookOpen, Users, Award, Hash } from 'lucide-react';

interface CourseTableProps {
  courses: Course[];
}

export function CourseTable({ courses }: CourseTableProps) {
  if (courses.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-extrabold text-base sm:text-lg uppercase tracking-tight flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
          <BookOpen className="w-5 h-5 text-yellow-500" />
          <span>Danh Sách Học Phần Đã Khai Báo</span>
        </h3>
        <span className="text-xs font-mono font-bold px-2.5 py-1 bg-yellow-400 text-black rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000]">
          TỔNG: {courses.length} MÔN
        </span>
      </div>

      <div className="border-2 border-black dark:border-zinc-700 rounded-2xl overflow-hidden shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#FFE600] bg-white dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-yellow-400 text-black border-b-2 border-black">
                <th className="w-16 px-4 py-3.5 text-center font-heading font-extrabold text-xs uppercase tracking-wider border-r-2 border-black">
                  <div className="flex items-center justify-center gap-1">
                    <Hash className="w-3.5 h-3.5" />
                    <span>ID</span>
                  </div>
                </th>
                <th className="px-4 py-3.5 font-heading font-extrabold text-xs uppercase tracking-wider border-r-2 border-black">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Tên Học Phần</span>
                  </div>
                </th>
                <th className="w-28 px-4 py-3.5 text-center font-heading font-extrabold text-xs uppercase tracking-wider border-r-2 border-black">
                  <div className="flex items-center justify-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>Tín Chỉ</span>
                  </div>
                </th>
                <th className="w-28 px-4 py-3.5 text-center font-heading font-extrabold text-xs uppercase tracking-wider border-r-2 border-black">
                  <div className="flex items-center justify-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Tối Đa</span>
                  </div>
                </th>
                <th className="w-28 px-4 py-3.5 text-center font-heading font-extrabold text-xs uppercase tracking-wider">
                  <div className="flex items-center justify-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Còn Lại</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-zinc-200 dark:divide-zinc-800 text-zinc-900 dark:text-zinc-100">
              {courses.map((course) => (
                <tr
                  key={course.id}
                  className="hover:bg-yellow-50 dark:hover:bg-zinc-800/60 transition-colors"
                >
                  <td className="px-4 py-3 text-center font-mono text-xs font-bold text-zinc-500 border-r-2 border-zinc-200 dark:border-zinc-800">
                    #{course.id}
                  </td>
                  <td className="px-4 py-3 font-semibold text-sm border-r-2 border-zinc-200 dark:border-zinc-800">
                    {course.tenMonHoc}
                  </td>
                  <td className="px-4 py-3 text-center border-r-2 border-zinc-200 dark:border-zinc-800">
                    <span className="px-2 py-0.5 bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-400 rounded-md font-mono text-xs font-bold">
                      {course.soTinChi} TC
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-xs font-semibold text-zinc-500 border-r-2 border-zinc-200 dark:border-zinc-800">
                    {course.soChoToiDa}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold font-mono border ${
                        course.soChoConLai === 0
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-400'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-400'
                      }`}
                    >
                      {course.soChoConLai} chỗ
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
