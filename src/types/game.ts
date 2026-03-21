/**
 * 游戏化系统类型定义
 */

// ==================== 等级系统 ====================

/**
 * 等级配置
 */
export interface LevelConfig {
  level: number;        // 等级
  name: string;         // 等级名称
  minExp: number;       // 所需最小经验值
  maxExp: number;       // 所需最大经验值
  expToNext: number;    // 升级所需经验值
  title: string;        // 称号
}

/**
 * 默认等级配置（例：LV1 - LV50）
 */
export const defaultLevelConfigs: LevelConfig[] = [
  { level: 1, name: '新手', minExp: 0, maxExp: 99, expToNext: 100, title: '萌新' },
  { level: 2, name: '新手', minExp: 100, maxExp: 299, expToNext: 300, title: '初级冒险者' },
  { level: 3, name: '初级', minExp: 300, maxExp: 699, expToNext: 400, title: '冒险者' },
  // TODO: 继续补充更多等级配置
];

/**
 * 根据经验值计算等级
 */
export function getLevelByExp(exp: number): LevelConfig {
  for (let i = defaultLevelConfigs.length - 1; i >= 0; i--) {
    if (exp >= defaultLevelConfigs[i].minExp) {
      return defaultLevelConfigs[i];
    }
  }
  return defaultLevelConfigs[0];
}

/**
 * 计算等级进度百分比
 */
export function getLevelProgress(exp: number, level: LevelConfig): number {
  if (level.expToNext === 0) return 100;
  const currentLevelExp = exp - level.minExp;
  return Math.min(100, Math.max(0, (currentLevelExp / level.expToNext) * 100));
}

// ==================== 游戏化 UI 组件类型 ====================

/**
 * 进度条类型
 */
export interface ProgressBarProps {
  value: number;           // 当前进度
  max?: number;            // 最大值（默认100）
  color?: string;          // 颜色
  bgColor?: string;        // 背景颜色
  height?: string;         // 高度
  showLabel?: boolean;     // 是否显示标签
  labelFormat?: string;    // 标签格式（如：{value}/{max}）
  animated?: boolean;      // 是否有动画
}

/**
 * 任务卡片类型
 */
export interface TaskCardProps {
  task: any;               // 任务对象
  status?: TaskStatus;     // 任务状态
  onComplete?: () => void; // 完成回调
}

/**
 * 心愿卡片类型
 */
export interface WishlistCardProps {
  wishlist: any;           // 心愿对象
  onDeposit?: () => void;  // 存钱回调
  onDetail?: () => void;   // 详情回调
}

/**
 * 统计卡片类型
 */
export interface StatCardProps {
  title: string;           // 标题
  value: number | string;  // 数值
  unit?: string;           // 单位
  icon?: string;           // 图标
  color?: string;          // 颜色
  trend?: 'up' | 'down' | 'stable';  // 趋势
  trendValue?: number;     // 趋势数值
}

/**
 * 金币/EXP 展示类型
 */
export interface CurrencyDisplayProps {
  type: 'coin' | 'exp';   // 货币类型
  value: number;          // 数值
  showIcon?: boolean;     // 是否显示图标
  size?: 'small' | 'medium' | 'large'; // 尺寸
}

/**
 * 徽章类型
 */
export interface BadgeProps {
  text: string;           // 徽章文字
  color?: string;         // 颜色
  size?: 'small' | 'medium' | 'large'; // 尺寸
  icon?: string;          // 图标
}

// ==================== 动效类型 ====================

/**
 * 彩带动效配置
 */
export interface ConfettiConfig {
  duration?: number;      // 动画时长（毫秒）
  particleCount?: number; // 粒子数量
  colors?: string[];      // 颜色数组
}

/**
 * 任务完成动效类型
 */
export type TaskCompleteEffect = 'confetti' | 'sparkle' | 'firework' | 'none';

// ==================== 游戏化主题类型 ====================

/**
 * 主题配色
 */
export interface GameTheme {
  primary: string;        // 主色
  primaryGradient: string; // 主色渐变
  accent: string;         // 强调色
  success: string;        // 成功色
  warning: string;        // 警告色
  danger: string;         // 危险色
  gold: string;           // 金币色
  exp: string;            // 经验色
  level: string;          // 等级色
}

/**
 * 默认游戏化主题
 */
export const defaultGameTheme: GameTheme = {
  primary: '#667eea',
  primaryGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  accent: '#ff6b6b',
  success: '#51cf66',
  warning: '#fcc419',
  danger: '#fa5252',
  gold: '#ffd43b',
  exp: '#667eea',
  level: '#51cf66',
};

// ==================== 任务分类图标映射 ====================

/**
 * 任务分类图标
 */
export const TASK_CATEGORY_ICONS: Record<number, string> = {
  0: '📌',  // 通用
  1: '📚',  // 学习
  2: '💼',  // 工作
  3: '🏃',  // 运动
  4: '🏠',  // 生活
  5: '💡',  // 创意
};

/**
 * 任务分类颜色
 */
export const TASK_CATEGORY_COLORS: Record<number, string> = {
  0: '#999',   // 通用
  1: '#51cf66', // 学习
  2: '#339af0', // 工作
  3: '#fcc419', // 运动
  4: '#ff922b', // 生活
  5: '#9775fa', // 创意
};

// ==================== 成就系统类型 ====================

/**
 * 成就类型
 */
export interface Achievement {
  id: string;                // 成就ID
  title: string;             // 成就标题
  description: string;       // 成就描述
  icon: string;              // 图标
  rarity: 'common' | 'rare' | 'epic' | 'legendary'; // 稀有度
  unlocked: boolean;         // 是否解锁
  unlockedAt?: string;       // 解锁时间
  progress?: number;         // 进度
  maxProgress?: number;      // 最大进度
}

/**
 * 成就类型
 */
export enum AchievementType {
  TASK_COUNT = 'task_count',        // 任务总数
  TASK_STREAK = 'task_streak',      // 连续打卡
  COIN_COLLECT = 'coin_collect',    // 收集金币
  EXP_LEVE = 'exp_level',          // 等级提升
  WISHLIST_COMPLETE = 'wishlist_complete', // 心愿完成
  // TODO: 更多成就类型
}
