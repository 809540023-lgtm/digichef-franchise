import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChefHat,
  Cpu,
  Cloud,
  TrendingUp,
  Users,
  Calendar,
  Smartphone,
  Zap,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Thermometer,
  Activity,
  Package,
  Timer,
  Target,
  Briefcase,
  GraduationCap,
  DollarSign,
  Store,
  Heart,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css';

// Google Analytics 類型聲明
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// 安全呼叫 GA4（避免 module-level 捕獲 undefined 的問題）
const trackEvent = (eventName: string, params?: Record<string, string>) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
};

// ============================================================
// 自訂 Hook：Scroll Reveal（IntersectionObserver）
// ============================================================
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    const elements = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale'
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

// ============================================================
// 自訂 Hook：數字遞增動畫
// ============================================================
function useCountUp(target: number, duration = 1800, suffix = '') {
  const [display, setDisplay] = useState('0' + suffix);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  const startCount = useCallback(() => {
    if (started.current) return;
    started.current = true;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setDisplay(current + suffix);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, suffix]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) startCount(); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [startCount]);

  return { display, ref };
}

// 模拟数据
const orderData = [
  { time: '08:00', orders: 12, completed: 10 },
  { time: '09:00', orders: 25, completed: 22 },
  { time: '10:00', orders: 45, completed: 40 },
  { time: '11:00', orders: 78, completed: 70 },
  { time: '12:00', orders: 120, completed: 110 },
  { time: '13:00', orders: 95, completed: 90 },
  { time: '14:00', orders: 35, completed: 33 },
];

const machineData = [
  { name: 'iCombi Pro 1', temp: 185, status: '烹調中', progress: 65 },
  { name: 'iCombi Pro 2', temp: 120, status: '預熱中', progress: 30 },
  { name: 'iCombi Pro 3', temp: 90, status: '保溫中', progress: 100 },
];

const staffSchedule = [
  { time: '08:00-10:00', required: 2, scheduled: 2, frozen: '冷凍包生產' },
  { time: '10:00-12:00', required: 4, scheduled: 4, frozen: '便當製作' },
  { time: '12:00-14:00', required: 5, scheduled: 5, frozen: '高峰時段' },
  { time: '14:00-16:00', required: 2, scheduled: 2, frozen: '冷凍包生產' },
  { time: '16:00-18:00', required: 3, scheduled: 3, frozen: '預備食材' },
  { time: '18:00-20:00', required: 4, scheduled: 4, frozen: '晚餐時段' },
];

// 誰適合加盟數據
const franchiseTargets = [
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: '上班族轉職',
    desc: '厭倦了朝九晚五，想擁有自己的事業',
    features: ['無需餐飲經驗', 'AI設備易上手', '總部完整培訓']
  },
  {
    icon: <GraduationCap className="w-8 h-8" />,
    title: '年輕創業家',
    desc: '有創業夢想，但資金有限想降低風險',
    features: ['低人力成本', '自動化營運', '彈性工作時間']
  },
  {
    icon: <Store className="w-8 h-8" />,
    title: '餐飲業者轉型',
    desc: '已有餐飲經驗，想導入科技提升效率',
    features: ['產能提升50%', '人力節省60%', '雲端管理系統']
  },
  {
    icon: <DollarSign className="w-8 h-8" />,
    title: '投資理財族',
    desc: '尋找穩定現金流的投資項目',
    features: ['完整財務報表', '透明營運數據', '專業團隊支援']
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: '家庭主婦/主夫',
    desc: '想兼顧家庭同時擁有事業第二春',
    features: ['彈性排班系統', '雲端遠端管理', '標準化流程']
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: '退休人士',
    desc: '退休後想繼續發揮價值，輕鬆經營',
    features: ['簡單易操作', '低體力負擔', '穩定收入來源']
  }
];

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);

  // 啟動 Scroll Reveal
  useScrollReveal();

  // 數字遞增動畫
  const counter50 = useCountUp(50, 1600, '%');
  const counter60 = useCountUp(60, 1800, '%');

  // 顯示 Floating CTA（滾動超過 hero 後顯示）
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingCTA(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // Formspree 表單提交
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/xzdjbyyg', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        setFormSubmitted(true);
        form.reset();
        // ✅ 正確呼叫 GA4（使用 trackEvent 而非模組層級變數）
        trackEvent('form_submit', {
          event_category: '加盟諮詢',
          event_label: '表單提交成功'
        });
      } else {
        alert('提交失敗，請稍後再試或直接來電聯繫');
      }
    } catch {
      alert('提交失敗，請稍後再試或直接來電聯繫');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-cyan-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                DigiChef
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <button onClick={() => scrollToSection('hero')} className="hover:text-cyan-400 transition">首頁</button>
              <button onClick={() => scrollToSection('target')} className="hover:text-cyan-400 transition">誰適合加盟</button>
              <button onClick={() => scrollToSection('system')} className="hover:text-cyan-400 transition">智能系統</button>
              <button onClick={() => scrollToSection('equipment')} className="hover:text-cyan-400 transition">設備展示</button>
              <button onClick={() => scrollToSection('franchise')} className="hover:text-cyan-400 transition">加盟諮詢</button>
              <Button onClick={() => setShowDemoModal(true)} className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
                系統演示
              </Button>
            </div>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700">
            <div className="px-4 py-4 space-y-3">
              <button onClick={() => scrollToSection('hero')} className="block w-full text-left py-2">首頁</button>
              <button onClick={() => scrollToSection('target')} className="block w-full text-left py-2">誰適合加盟</button>
              <button onClick={() => scrollToSection('system')} className="block w-full text-left py-2">智能系統</button>
              <button onClick={() => scrollToSection('equipment')} className="block w-full text-left py-2">設備展示</button>
              <button onClick={() => scrollToSection('franchise')} className="block w-full text-left py-2">加盟諮詢</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Floating Particles */}
        <div aria-hidden="true">
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="reveal bg-cyan-500/20 text-cyan-400 border-cyan-500/50 text-sm px-4 py-1">
                🚀 2026 創業新勢力
              </Badge>
              <h1 className="reveal text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                全台首間
                <span className="gradient-animate block">
                  AI 智慧數位廚房
                </span>
                便當加盟
              </h1>
              <p className="reveal text-lg text-slate-300 leading-relaxed">
                結合 RATIONAL 智能蒸烤系統、ConnectedCooking 雲端平台、Eats365 POS 系統，
                打造低人力、高產能、全自動化的智慧餐飲新時代。
              </p>
              <div className="reveal flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={() => scrollToSection('franchise')}
                  className="btn-shine bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-lg px-8"
                >
                  立即加盟諮詢 <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowDemoModal(true)}
                  className="border-slate-500 hover:bg-slate-800 text-lg px-8"
                >
                  觀看系統演示
                </Button>
              </div>
              <div className="reveal grid grid-cols-3 gap-6 pt-4 stagger">
                <div className="stat-card text-center bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="text-3xl font-bold text-cyan-400">
                    <span ref={counter50.ref}>{counter50.display}</span>
                  </div>
                  <div className="text-sm text-slate-400">產能提升</div>
                </div>
                <div className="stat-card text-center bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="text-3xl font-bold text-purple-400">
                    <span ref={counter60.ref}>{counter60.display}</span>
                  </div>
                  <div className="text-sm text-slate-400">人力節省</div>
                </div>
                <div className="stat-card text-center bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="text-3xl font-bold text-pink-400">24H</div>
                  <div className="text-sm text-slate-400">雲端監控</div>
                </div>
              </div>
            </div>
            <div className="reveal-right relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop"
                alt="Smart Kitchen"
                className="hero-image-glow relative rounded-3xl shadow-2xl border border-slate-700 w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-slate-800 rounded-2xl p-4 border border-slate-700 shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">系統運行中</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">128 台設備連線中</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Should Join Section - 誰適合加盟 */}
      <section id="target" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="reveal bg-pink-500/20 text-pink-400 border-pink-500/50 mb-4">
              <Target className="w-4 h-4 mr-1" /> 加盟對象
            </Badge>
            <h2 className="reveal text-3xl sm:text-4xl font-bold mb-4">
              誰適合加盟 DigiChef？
            </h2>
            <p className="reveal text-slate-400 max-w-2xl mx-auto">
              無論您是創業新手還是經驗豐富的餐飲人，DigiChef 都能幫助您實現創業夢想
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
            {franchiseTargets.map((item, idx) => (
              <Card key={idx} className="reveal card-hover bg-slate-900/50 border-slate-700 hover:border-cyan-500/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center text-cyan-400 mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{item.desc}</p>
                  <ul className="space-y-2">
                    {item.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-center text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FB 貼文內容展示 */}
          <div className="mt-16">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-cyan-400">
                  <Smartphone className="w-5 h-5 mr-2" />
                  加盟優勢一覽
                </CardTitle>
                <CardDescription className="text-slate-400">
                  來看看 DigiChef 如何�9�助不同背景的創業者成功
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-medium text-lg text-cyan-400">🚀 創業首發優勢</h4>
                    <div className="bg-slate-800 rounded-lg p-4 text-sm text-slate-300 leading-relaxed space-y-2">
                      <p>✨ <strong>AI 數位大腦</strong> - RATIONAL iCombi Pro 智能蒸烤系統，產能提升50%</p>
                      <p>☁️ <strong>雲端管理系統</strong> - ConnectedCooking 平台，在家也能控店</p>
                      <p>📊 <strong>數據驅動獲利</strong> - Eats365 POS系統，FLR嚴控70%以下</p>
                      <p>⚖️ <strong>專業法律保障</strong> - 律師審核合約，加盟三金透明</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium text-lg text-purple-400">💡 智能系統特色</h4>
                    <div className="bg-slate-800 rounded-lg p-4 text-sm text-slate-300 leading-relaxed space-y-2">
                      <p>📱 <strong>線上訂餐</strong> - 顧客手機下單，訂單直達廚房</p>
                      <p>🔥 <strong>設備監控</strong> - 手機隨時查看溫度、進度、能耗</p>
                      <p>👥 <strong>彈性人力</strong> - 員工自主選時段，系統自動排班</p>
                      <p>⏰ <strong>自動排程</strong> - 有單做便當、沒單做冷凍包，零空檔</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-500/30">
                  <p className="text-center text-slate-300">
                    🌟 <strong>首店限定合作案</strong> 同步開啟！我們正在尋找第一批與我們並肩作戰的夥伴。
                    如果您渴望一間低人力依賴、高生產力、科技感十足的智慧餐廳，現在就是您的最佳進場時機！
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Smart System Demo Section */}
      <section id="system" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="reveal bg-purple-500/20 text-purple-400 border-purple-500/50 mb-4">
              <Cpu className="w-4 h-4 mr-1" /> 智能管理系統
            </Badge>
            <h2 className="reveal text-3xl sm:text-4xl font-bold mb-4">
              一站式智慧餐飲解決方案
            </h2>
            <p className="reveal text-slate-400 max-w-2xl mx-auto">
              從訂單接收、設備監控、人員排程到冷凍包生產，全部自動化處理，
              讓您隨時隨地掌握店內狀況
            </p>
          </div>

          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-slate-900/50 p-1 mb-8">
              <TabsTrigger value="orders" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                <Smartphone className="w-4 h-4 mr-2" /> 線上訂餐
              </TabsTrigger>
              <TabsTrigger value="machines" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
                <Activity className="w-4 h-4 mr-2" /> 設備監控
              </TabsTrigger>
              <TabsTrigger value="staff" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-400">
                <Users className="w-4 h-4 mr-2" /> 人員管理
              </TabsTrigger>
              <TabsTrigger value="schedule" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                <Calendar className="w-4 h-4 mr-2" /> 自動排程
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-cyan-400">
                    <Smartphone className="w-5 h-5 mr-2" />
                    即時訂單系統
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    顧客線上訂餐即時同步至廚房，無需人工接單，自動安排生產順序
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium">今日訂單統計</span>
                          <Badge className="bg-green-500/20 text-green-400">即時更新</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="bg-slate-900 rounded-lg p-3">
                            <div className="text-2xl font-bold text-cyan-400">410</div>
                            <div className="text-xs text-slate-400">總訂單</div>
                          </div>
                          <div className="bg-slate-900 rounded-lg p-3">
                            <div className="text-2xl font-bold text-green-400">385</div>
                            <div className="text-xs text-slate-400">已完成</div>
                          </div>
                          <div className="bg-slate-900 rounded-lg p-3">
                            <div className="text-2xl font-bold text-yellow-400">25</div>
                            <div className="text-xs text-slate-400">製作中</div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                        <div className="text-sm font-medium mb-3">最新訂單</div>
                        <div className="space-y-2">
                          {[
                            { id: '#2024030501', item: '招牌滷肉飯便當', time: '2分鐘前', status: '製作中' },
                            { id: '#2024030502', item: '健康雞胸餐盒', time: '5分鐘前', status: '等待中' },
                            { id: '#2024030503', item: '素食養生便當', time: '8分鐘前', status: '已完成' },
                          ].map((order) => (
                            <div key={order.id} className="flex items-center justify-between bg-slate-900 rounded p-3 text-sm">
                              <div>
                                <div className="font-medium">{order.item}</div>
                                <div className="text-slate-400 text-xs">{order.id} · {order.time}</div>
                              </div>
                              <Badge className={
                                order.status === '已完成' ? 'bg-green-500/20 text-green-400' :
                                order.status === '製作中' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-slate-600/20 text-slate-400'
                              }>
                                {order.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                      <div className="text-sm font-medium mb-3">訂單趨勢圖</div>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={orderData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                          <YAxis stroke="#64748b" fontSize={12} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                            labelStyle={{ color: '#94a3b8' }}
                          />
                          <Line type="monotone" dataKey="orders" stroke="#06b6d4" strokeWidth={2} name="新訂單" />
                          <Line type="monotone" dataKey="completed" stroke="#22c55e" strokeWidth={2} name="已完成" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="machines" className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-400">
                    <Activity className="w-5 h-5 mr-2" />
                    設備即時監控
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    透過 ConnectedCooking 平台，隨時查看設備狀態、溫度、能耗數據
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {machineData.map((machine, idx) => (
                      <div key={idx} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-medium">{machine.name}</span>
                          <div className={`w-3 h-3 rounded-full ${
                            machine.status === '烹調中' ? 'bg-green-500 animate-pulse' :
                            machine.status === '預熱中' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}></div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">溫度</span>
                            <span className="flex items-center">
                              <Thermometer className="w-4 h-4 mr-1 text-orange-400" />
                              {machine.temp}°C
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">狀態</span>
                            <Badge className="bg-slate-700">{machine.status}</Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-400">完成度</span>
                              <span>{machine.progress}%</span>
                            </div>
                            <Progress value={machine.progress} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium">能耗監控</span>
                      <Badge className="bg-green-500/20 text-green-400">節能 30%</Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-400">12.5</div>
                        <div className="text-xs text-slate-400">今日用電(kWh)</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-cyan-400">85%</div>
                        <div className="text-xs text-slate-400">設備效率</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-400">0</div>
                        <div className="text-xs text-slate-400">異常警報</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-pink-400">24/7</div>
                        <div className="text-xs text-slate-400">監控狀態</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="staff" className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-pink-400">
                    <Users className="w-5 h-5 mr-2" />
                    彈性人員管理系統
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    員工自主選擇上班時段，系統自動計算所需人力，確保每個時段都有充足人手
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-medium">今日人力配置</span>
                          <Badge className="bg-green-500/20 text-green-400">充足</Badge>
                        </div>
                        <div className="space-y-3">
                          {staffSchedule.map((slot, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-slate-900 rounded p-3">
                              <div>
                                <div className="text-sm font-medium">{slot.time}</div>
                                <div className="text-xs text-slate-400">{slot.frozen}</div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <div className="text-sm">{slot.scheduled}/{slot.required} 人</div>
                                  <Progress 
                                    value={(slot.scheduled / slot.required) * 100} 
                                    className="w-20 h-2 mt-1"
                                  />
                                </div>
                                <Badge className={
                                  slot.scheduled >= slot.required ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                }>
                                  {slot.scheduled >= slot.required ? '✓' : '!'}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                        <div className="font-medium mb-4">員工上班時段選擇</div>
                        <div className="bg-slate-900 rounded-lg p-4">
                          <div className="text-sm text-slate-400 mb-3">點擊時段報名上班</div>
                          <div className="grid grid-cols-3 gap-2">
                            {['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00'].map((time) => (
                              <button 
                                key={time}
                                className="bg-slate-800 hover:bg-cyan-500/20 hover:border-cyan-500 border border-slate-700 rounded-lg py-2 px-3 text-sm transition"
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                          <div className="mt-4 pt-4 border-t border-slate-700">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-400">已選時段</span>
                              <span>2 個時段 (8小時)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg p-4 border border-pink-500/30">
                        <div className="flex items-start space-x-3">
                          <Zap className="w-5 h-5 text-pink-400 mt-0.5" />
                          <div>
                            <div className="font-medium text-pink-400">智能人力優化</div>
                            <div className="text-sm text-slate-300 mt-1">
                              系統根據訂單預測自動計算所需人力，員工彈性選擇時段，
                              無訂單時段自動安排冷凍包生產，零空檔時間！
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-400">
                    <Calendar className="w-5 h-5 mr-2" />
                    自動生產排程系統
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    有訂單時製作便當，無訂單時自動生產冷凍包，員工時間充分利用
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                        <div className="font-medium mb-4">今日生產排程</div>
                        <div className="space-y-3">
                          {[
                            { time: '08:00-10:00', type: '冷凍包生產', desc: '預製雞胸肉、滷肉', status: '已完成', efficiency: '100%' },
                            { time: '10:00-12:00', type: '便當製作', desc: '線上訂單 45 份', status: '進行中', efficiency: '95%' },
                            { time: '12:00-14:00', type: '高峰時段', desc: '線上訂單 + 現場 120 份', status: '進行中', efficiency: '90%' },
                            { time: '14:00-16:00', type: '冷凍包生產', desc: '預備晚餐食材', status: '待開始', efficiency: '-' },
                            { time: '16:00-18:00', type: '便當製作', desc: '線上訂單 35 份', status: '待開始', efficiency: '-' },
                            { time: '18:00-20:00', type: '晚餐高峰', desc: '線上訂單 + 現場 85 $��', status: '待開始', efficiency: '-' },
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-slate-900 rounded-lg p-4">
                              <div className="flex items-center space-x-4">
                                <div className="w-16 text-sm font-medium text-slate-400">{item.time}</div>
                                <div>
                                  <div className="font-medium flex items-center">
                                    {item.type === '冷凍包生產' ? <Package className="w-4 h-4 mr-1 text-blue-400" /> : <ChefHat className="w-4 h-4 mr-1 text-orange-400" />}
                                    {item.type}
                                  </div>
                                  <div className="text-xs text-slate-400">{item.desc}</div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <Badge className={
                                  item.status === '已完成' ? 'bg-green-500/20 text-green-400' :
                                  item.status === '進行中' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-slate-600/20 text-slate-400'
                                }>
                                  {item.status}
                                </Badge>
                                <div className="w-16 text-right text-sm">{item.efficiency}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                        <div className="font-medium mb-4">生產效率統計</div>
                        <div className="space-y-4">
                          <div className="bg-slate-900 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-green-400">98%</div>
                            <div className="text-sm text-slate-400">時間利用率</div>
                          </div>
                          <div className="bg-slate-900 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-cyan-400">156</div>
                            <div className="text-sm text-slate-400">今日冷凍包產量</div>
                          </div>
                          <div className="bg-slate-900 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-purple-400">0</div>
                            <div className="text-sm text-slate-400">空檔時間(分鐘)</div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-lg p-4 border border-green-500/30">
                        <div className="flex items-start space-x-3">
                          <Timer className="w-5 h-5 text-green-400 mt-0.5" />
                          <div>
                            <div className="font-medium text-green-400">零浪費時間</div>
                            <div className="text-sm text-slate-300 mt-1">
                              系統智能判斷訂單量，自動切換生產模式，
                              員工每分鐘都在創造價值！
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Equipment Section */}
      <section id="equipment" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="reveal bg-cyan-500/20 text-cyan-400 border-cyan-500/50 mb-4">
              <Zap className="w-4 h-4 mr-1" /> 核心設備
            </Badge>
            <h2 className="reveal text-3xl sm:text-4xl font-bold mb-4">
              RATIONAL iCombi Pro 智能蒸烤系統
            </h2>
            <p className="reveal text-slate-400 max-w-2xl mx-auto">
              德國原裝進口，一台設備取代蒸爐、烤箱、炸鍋等十種設備，
              AI 智能控制，新手也能做出大廚水準
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="reveal-left space-y-6">
              <img
                src="https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&h=500&fit=crop"
                alt="RATIONAL iCombi Pro"
                className="hero-image-glow rounded-2xl shadow-2xl border border-slate-700 w-full"
              />
            </div>
            <div className="reveal-right space-y-6">
              <div className="grid gap-4">
                {[
                  { icon: <Cpu className="w-5 h-5" />, title: 'iCookingSuite', desc: 'AI 智能烹調，自動偵測食材狀態調整參數' },
                  { icon: <Cloud className="w-5 h-5" />, title: 'ConnectedCooking', desc: '雲端管理，遠端監控所有設備狀態' },
                  { icon: <Activity className="w-5 h-5" />, title: 'iDensityControl', desc: '智能氣候管理，確保每次烹調完美' },
                  { icon: <Zap className="w-5 h-5" />, title: 'iCareSystem', desc: '自動清潔保養，省時省力又衛生' },
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-4 bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400 flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <div className="font-medium text-cyan-400">{feature.title}</div>
                      <div className="text-sm text-slate-400 mt-1">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="bg-slate-800 rounded-lg p-4 text-center border border-slate-700">
                  <div className="text-2xl font-bold text-cyan-400">6合1</div>
                  <div className="text-xs text-slate-400">烹調模式</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 text-center border border-slate-700">
                  <div className="text-2xl font-bold text-purple-400">50%</div>
                  <div className="text-xs text-slate-400">產能提升</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 text-center border border-slate-700">
                  <div className="text-2xl font-bold text-green-400">30%</div>
                  <div className="text-xs text-slate-400">能源節省</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Franchise Form Section */}
      <section id="franchise" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="reveal bg-pink-500/20 text-pink-400 border-pink-500/50 mb-4">
              <TrendingUp className="w-4 h-4 mr-1" /> 加盟諮詢
            </Badge>
            <h2 className="reveal text-3xl sm:text-4xl font-bold mb-4">
              開啟您的智慧餐飲事業
            </h2>
            <p className="reveal text-slate-400">
              填寫以下表單，我們將有專人與您聯繫，提供詳細的加盟說明
            </p>
          </div>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-8">
              {formSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-400 mb-2">提交成功！</h3>
                  <p className="text-slate-400">我們將在 24 小時內與您聯繫</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">姓名 *</Label>
                      <Input name="name" id="name" placeholder="請輸入您的姓名" required className="bg-slate-800 border-slate-700" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">電話 *</Label>
                      <Input name="phone" id="phone" placeholder="請輸入聯絡電話" required className="bg-slate-800 border-slate-700" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input name="email" id="email" type="email" placeholder="請輸入電子郵件" className="bg-slate-800 border-slate-700" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">預計開店區域 *</Label>
                      <Input name="location" id="location" placeholder="例如：台北市信義區" required className="bg-slate-800 border-slate-700" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="budget">預計投資金額</Label>
                      <select name="budget" id="budget" className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white">
                        <option value="">請選擇</option>
                        <option value="100-150">100-150 萬</option>
                        <option value="150-200">150-200 萬</option>
                        <option value="200-250">200-250 萬</option>
                        <option value="250+">250 萬以上</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">餐飲經驗</Label>
                      <select name="experience" id="experience" className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white">
                        <option value="">請選擇</option>
                        <option value="none">無經驗</option>
                        <option value="1-3">1-3 年</option>
                        <option value="3-5">3-5 年</option>
                        <option value="5+">5 年以上</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">其他問題或備註</Label>
                    <Textarea name="message" id="message" placeholder="請輸入您想了解的問題..." rows={4} className="bg-slate-800 border-slate-700" />
                  </div>
                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={formSubmitting}
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 disabled:opacity-50"
                  >
                    {formSubmitting ? '提交中...' : '提交加盟諮詢'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="flex items-center space-x-3 bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <Phone className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-sm text-slate-400">加盟專線</div>
                <div className="font-medium">0915-888927</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <Mail className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-sm text-slate-400">Email</div>
                <div className="font-medium text-sm">cia8885@gmail.com</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <MapPin className="w-5 h-5 text-pink-400" />
              <div>
                <div className="text-sm text-slate-400">總部地址</div>
                <div className="font-medium text-sm">新北市新莊區中原路232號5樓</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <ChefHat className="h-6 w-6 text-cyan-400" />
              <span className="text-lg font-bold">DigiChef</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-slate-400 text-center mb-4 md:mb-0">
              <button onClick={() => scrollToSection('target')} className="hover:text-cyan-400 transition">誰適合加盟</button>
              <button onClick={() => scrollToSection('system')} className="hover:text-cyan-400 transition">智能系統</button>
              <button onClick={() => scrollToSection('equipment')} className="hover:text-cyan-400 transition">設備展示</button>
              <button onClick={() => scrollToSection('franchise')} className="hover:text-cyan-400 transition">立即諮詢</button>
            </div>
            <div className="text-slate-400 text-sm text-center md:text-right">
              <p>© 2026 DigiChef 智慧數位廚房. All rights reserved.</p>
              <p className="mt-1">加盟專線：0915-888927 | cia8885@gmail.com</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating CTA Button (Mobile) */}
      <div className={`floating-cta ${showFloatingCTA ? 'visible' : ''}`}>
        <div className="floating-cta-ring" />
        <Button
          onClick={() => scrollToSection('franchise')}
          className="btn-shine relative z-10 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 shadow-2xl rounded-full px-5 py-3 text-sm font-semibold flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          立即諮詢
        </Button>
      </div>

      {/* Demo Modal */}
      <Dialog open={showDemoModal} onOpenChange={setShowDemoModal}>
        <DialogContent className="max-w-4xl bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center">
              <Cpu className="w-6 h-6 mr-2 text-cyan-400" />
              DigiChef 智能系統演示
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              體驗完整的智慧餐飲管理流程
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Tabs defaultValue="demo-orders" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800">
                <TabsTrigger value="demo-orders">訂單系統</TabsTrigger>
                <TabsTrigger value="demo-machines">設備監控</TabsTrigger>
                <TabsTrigger value="demo-staff">人員管理</TabsTrigger>
                <TabsTrigger value="demo-schedule">自動排程</TabsTrigger>
              </TabsList>
              <TabsContent value="demo-orders" className="p-4">
                <div className="bg-slate-800 rounded-lg p-6 text-center">
                  <Smartphone className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">線上訂餐流程</h3>
                  <p className="text-slate-400 text-sm">
                    顧客透過 APP 或網站下單 → 訂單即時同步至廚房 → 
                    系統自動安排生產順序 → 完成通知顧客取餐
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="demo-machines" className="p-4">
                <div className="bg-slate-800 rounded-lg p-6 text-center">
                  <Activity className="w-16 h-16 mx-auto text-purple-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">設備遠端監控</h3>
                  <p className="text-slate-400 text-sm">
                    即時查看設備溫度、狀態、能耗 → 異常自動警報 → 
                    遠端調整烹調參數 → HACCP 自動記錄
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="demo-staff" className="p-4">
                <div className="bg-slate-800 rounded-lg p-6 text-center">
                  <Users className="w-16 h-16 mx-auto text-pink-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">彈性人力管理</h3>
                  <p className="text-slate-400 text-sm">
                    員工 APP 選擇上班時段 → 系統計算所需人力 → 
                    自動排班通知 → 出勤打卡管理
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="demo-schedule" className="p-4">
                <div className="bg-slate-800 rounded-lg p-6 text-center">
                  <Calendar className="w-16 h-16 mx-auto text-green-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">智能生產排程</h3>
                  <p className="text-slate-400 text-sm">
                    有訂單時製作便當 → 無訂單時生產冷凍包 → 
                    員工時間零浪費 → 產能最大化
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
