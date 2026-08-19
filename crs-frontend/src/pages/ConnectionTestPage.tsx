import { useEffect, useState, useCallback } from 'react';
import {
  Loader2,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  PlayCircle,
  Database,
  Globe,
} from 'lucide-react';
import { getCourses } from '@/api/courseApi';
import type { Course } from '@/types/course';
import { StatusBadge, ServiceInfoBadge } from '@/components/StatusBadge';
import { CourseTable } from '@/components/CourseTable';
import { ErrorAlert } from '@/components/ErrorAlert';
import { JsonViewer } from '@/components/JsonViewer';
import { Button } from '@/components/ui/button';

type ConnectionStatus = 'loading' | 'success' | 'error';

// Mock data dự phòng khi backend chưa kịp phản hồi
const MOCK_COURSES: Course[] = [
  { id: 1, tenMonHoc: 'Kiến trúc Microservices với Spring Boot', soTinChi: 3, soChoToiDa: 40, soChoConLai: 12 },
  { id: 2, tenMonHoc: 'Lập trình Web Frontend hiện đại với React & TypeScript', soTinChi: 4, soChoToiDa: 35, soChoConLai: 0 },
  { id: 3, tenMonHoc: 'Bảo mật ứng dụng phân tán với JWT & Zero Trust', soTinChi: 3, soChoToiDa: 50, soChoConLai: 25 },
  { id: 4, tenMonHoc: 'Thiết kế cơ sở dữ liệu phân tán & Transaction', soTinChi: 3, soChoToiDa: 30, soChoConLai: 8 },
];

export function ConnectionTestPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('loading');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const fetchCourses = useCallback(() => {
    setIsRefreshing(true);
    setStatus('loading');
    setError(null);

    getCourses()
      .then((res) => {
        setCourses(res.data?.content || []);
        setStatus('success');
        setIsDemoMode(false);
      })
      .catch((err) => {
        console.error('Lỗi khi gọi API:', err);
        setError(
          'Không thể kết nối đến hệ thống qua API Gateway (8080). Backend services có thể chưa được khởi động.'
        );
        setStatus('error');
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const loadDemoData = () => {
    setCourses(MOCK_COURSES);
    setStatus('success');
    setError(null);
    setIsDemoMode(true);
  };

  return (
    <div className="w-full space-y-6">
      {/* Hero Banner Card */}
      <div className="w-full bg-yellow-400 text-black border-2 border-black rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_#000000]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white text-xs font-mono font-bold rounded-full">
              <Layers className="w-3.5 h-3.5 text-yellow-400" />
              <span>BUỔI 05 • KẾT NỐI QUA API GATEWAY</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-black leading-tight">
              Frontend Kết Nối API Gateway & CORS
            </h2>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-black/90 flex-wrap">
              <span className="px-2.5 py-1 bg-black/10 rounded-lg border border-black/20">crs-frontend (:5173)</span>
              <ArrowRight className="w-4 h-4 shrink-0 text-black" />
              <span className="px-2.5 py-1 bg-black/10 rounded-lg border border-black/20">api-gateway (:8080)</span>
              <ArrowRight className="w-4 h-4 shrink-0 text-black" />
              <span className="px-2.5 py-1 bg-black/10 rounded-lg border border-black/20">course-service (:8082)</span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button
              onClick={fetchCourses}
              disabled={isRefreshing}
              variant="outline"
              size="lg"
              className="bg-white text-black hover:bg-black hover:text-white dark:bg-black dark:text-white dark:hover:bg-zinc-800 dark:border-black font-extrabold"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Thử Kết Nối Lại</span>
            </Button>

            {status === 'error' && (
              <Button
                onClick={loadDemoData}
                variant="secondary"
                size="lg"
                className="bg-pink-400 text-black font-extrabold"
                title="Xem giao diện bảng môn học mẫu"
              >
                <Sparkles className="w-4 h-4" />
                <span>Xem Dữ Liệu Mẫu</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Cluster Microservices Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-2xl p-4 shadow-[3px_3px_0px_#000000] dark:shadow-[3px_3px_0px_#FFE600] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-zinc-500">Cổng Gateway</span>
            <Globe className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="font-heading font-black text-xl text-zinc-900 dark:text-zinc-100">:8080</p>
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 truncate">api-gateway</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-2xl p-4 shadow-[3px_3px_0px_#000000] dark:shadow-[3px_3px_0px_#FFE600] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-zinc-500">Auth Service</span>
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 border border-black" />
          </div>
          <p className="font-heading font-black text-xl text-zinc-900 dark:text-zinc-100">:8081</p>
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 truncate">auth-service</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-2xl p-4 shadow-[3px_3px_0px_#000000] dark:shadow-[3px_3px_0px_#FFE600] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-zinc-500">Course Service</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black" />
          </div>
          <p className="font-heading font-black text-xl text-zinc-900 dark:text-zinc-100">:8082</p>
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 truncate">course-service</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-2xl p-4 shadow-[3px_3px_0px_#000000] dark:shadow-[3px_3px_0px_#FFE600] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-zinc-500">Registration</span>
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 border border-black" />
          </div>
          <p className="font-heading font-black text-xl text-zinc-900 dark:text-zinc-100">:8083</p>
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 truncate">registration-service</p>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex gap-2.5 flex-wrap items-center">
        <ServiceInfoBadge type="gateway" label="Gateway: localhost:8080" />
        <ServiceInfoBadge type="endpoint" label="Endpoint: /api/courses" />
        <StatusBadge
          status={status}
          label={
            status === 'loading'
              ? 'Đang gửi request...'
              : status === 'error'
                ? 'Chưa kết nối được'
                : isDemoMode
                  ? `Dữ liệu mẫu (${courses.length} môn)`
                  : `Đã kết nối (${courses.length} môn)`
          }
        />
      </div>

      {/* Loading Box */}
      {status === 'loading' && (
        <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-2xl p-6 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#FFE600] flex items-center gap-4">
          <Loader2 className="w-7 h-7 animate-spin text-yellow-500 shrink-0" />
          <div>
            <p className="font-heading font-bold text-base text-zinc-900 dark:text-zinc-100">
              Đang gửi HTTP GET /api/courses tới API Gateway...
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Gateway sẽ tự động áp dụng CORS filter và định tuyến ngầm tới course-service (port 8082).
            </p>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {status === 'success' && (
        <div className="bg-emerald-500/10 dark:bg-emerald-950/30 border-2 border-emerald-500 rounded-2xl p-5 shadow-[4px_4px_0px_#10B981] flex items-start sm:items-center gap-3.5">
          <div className="p-2 bg-emerald-500 text-white rounded-xl border-2 border-black shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <p className="font-heading font-extrabold text-base uppercase tracking-tight text-zinc-900 dark:text-zinc-100">
              {isDemoMode ? 'Đang Hiển Thị Dữ Liệu Mẫu (Demo)' : 'Kết Nối Thành Công! Không Bị Lỗi CORS'}
            </p>
            <p className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {isDemoMode
                ? 'Đây là dữ liệu mẫu để bạn xem thử bố cục UI. Khi bạn khởi động backend và bấm "Thử Kết Nối Lại", dữ liệu thật từ MySQL sẽ tự động hiển thị.'
                : 'API Gateway đã xử lý CORS tập trung thành công và chuyển tiếp dữ liệu môn học từ course-service về Frontend.'}
            </p>
          </div>
        </div>
      )}

      {/* Error state & Quick Starter */}
      {status === 'error' && error && (
        <div className="space-y-4">
          <ErrorAlert
            title={error}
            description="Hãy đảm bảo bạn đã khởi động MySQL và ít nhất 2 service: course-service (8082) và api-gateway (8080)."
          />

          {/* Quick Troubleshooting Guide */}
          <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-2xl p-5 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#FFE600] space-y-3">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="w-full flex items-center justify-between text-left font-heading font-extrabold text-sm uppercase tracking-wider text-zinc-900 dark:text-zinc-100 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-yellow-500" />
                <span>Cách Khởi Động Backend & Khắc Phục Lỗi (Buổi 05 - Mục D)</span>
              </div>
              {showGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showGuide && (
              <div className="pt-3 border-t-2 border-zinc-200 dark:border-zinc-800 space-y-3.5 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200">
                <div className="space-y-1.5">
                  <p className="font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                    <Database className="w-4 h-4" />
                    <span>Bước 1: Chạy MySQL cục bộ (Port 3306)</span>
                  </p>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs">
                    Đảm bảo MySQL đang chạy với tài khoản <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded font-mono">root / root</code>.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <PlayCircle className="w-4 h-4" />
                    <span>Bước 2: Chạy Course Service & API Gateway</span>
                  </p>
                  <div className="bg-zinc-900 text-zinc-100 dark:bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 font-mono text-xs space-y-2">
                    <div>
                      <span className="text-zinc-500"># Terminal 1 - Chạy Course Service:</span>
                      <p className="text-emerald-400 font-bold">cd course-service && mvnw spring-boot:run</p>
                    </div>
                    <div>
                      <span className="text-zinc-500"># Terminal 2 - Chạy API Gateway:</span>
                      <p className="text-yellow-400 font-bold">cd api-gateway && mvnw spring-boot:run</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-purple-600 dark:text-purple-400">Bước 3: Bấm nút "Thử Kết Nối Lại"</p>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs">
                    Sau khi console hiện <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded font-mono">Started Application in ... seconds</code>, bấm nút <strong>Thử Kết Nối Lại</strong> ở góc trên.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Courses Table */}
      {courses.length > 0 && <CourseTable courses={courses} />}

      {/* Raw JSON */}
      {courses.length > 0 && (
        <JsonViewer data={courses} title="Dữ Liệu JSON Phản Hồi Từ API Gateway" />
      )}
    </div>
  );
}
