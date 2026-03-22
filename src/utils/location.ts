/**
 * 地理位置工具模块
 * 提供位置获取和地图 URL 构建功能
 */

export interface Location {
  latitude: number;
  longitude: number;
}

export type MapPlatform = "dianping" | "baidu" | "amap" | "tencent";

/**
 * 获取用户当前位置
 */
export async function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("浏览器不支持地理位置功能"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let message = "获取位置失败";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "用户拒绝了位置权限";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "位置信息不可用";
            break;
          case error.TIMEOUT:
            message = "获取位置超时";
            break;
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5分钟内缓存
      },
    );
  });
}

/**
 * 检查浏览器是否支持地理位置
 */
export function isGeolocationSupported(): boolean {
  return "geolocation" in navigator;
}

/**
 * 判断是否移动端
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

/**
 * 构建地图搜索 URL
 */
export function buildMapUrl(
  platform: MapPlatform,
  keyword: string,
  location?: Location,
): string {
  const encodedKeyword = encodeURIComponent(keyword);
  const isMobile = isMobileDevice();

  switch (platform) {
    case "dianping":
      // 大众点评
      if (isMobile) {
        // 移动端：使用搜索频道页
        return `https://www.dianping.com/search/keyword/203/0_${encodedKeyword}`;
      }
      // PC端：直接搜索
      return `https://www.dianping.com/search/keyword/203/0_${encodedKeyword}`;

    case "baidu":
      // 百度地图
      if (location) {
        // 有位置时：使用附近搜索
        return `https://map.baidu.com/search/${encodedKeyword}/@${location.longitude},${location.latitude},15z`;
      }
      // 无位置：全国搜索
      return `https://map.baidu.com/search/${encodedKeyword}/`;

    case "amap":
      // 高德地图
      // 使用高德网页搜索（不需要 API key）
      return `https://www.amap.com/search?query=${encodedKeyword}`;

    case "tencent":
      // 腾讯地图
      // 使用腾讯地图网页版搜索
      return `https://map.qq.com/search/${encodedKeyword}`;

    default:
      return "";
  }
}

/**
 * 获取地图 App 的 Deep Link（用于打开原生 App）
 * 这些 URL scheme 可以直接打开对应的地图 App
 */
export function getMapAppDeepLink(
  platform: MapPlatform,
  keyword: string,
  location?: Location,
): string {
  const encodedKeyword = encodeURIComponent(keyword);

  // App Deep Links（如果用户安装了 App 会直接打开）
  const deepLinks: Record<MapPlatform, string> = {
    dianping: `dianping://search?keyword=${encodedKeyword}`,
    baidu: location
      ? `baidumap://map/place/search?query=${encodedKeyword}&center=${location.latitude},${location.longitude}`
      : `baidumap://map/place/search?query=${encodedKeyword}`,
    amap: location
      ? `androidamap://openFeature?featureName=Search&query=${encodedKeyword}&longitude=${location.longitude}&latitude=${location.latitude}`
      : `androidamap://openFeature?featureName=Search&query=${encodedKeyword}`,
    tencent: `qqmap://map/search?keyword=${encodedKeyword}`,
  };

  return deepLinks[platform];
}

/**
 * 打开地图（优先尝试 App，失败则使用网页版）
 */
export async function openMap(
  platform: MapPlatform,
  keyword: string,
  location?: Location,
): Promise<void> {
  const deepLink = getMapAppDeepLink(platform, keyword, location);
  const webUrl = buildMapUrl(platform, keyword, location);

  // 尝试打开 App
  try {
    // 使用 iframe 尝试打开 App（更安静地失败）
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = deepLink;
    document.body.appendChild(iframe);

    // 设置超时后使用网页版
    setTimeout(() => {
      document.body.removeChild(iframe);
      // 如果 2 秒后 iframe 还在，说明 App 没有打开
      window.open(webUrl, "_blank", "noopener,noreferrer");
    }, 1500);
  } catch {
    // 如果出错，直接使用网页版
    window.open(webUrl, "_blank", "noopener,noreferrer");
  }
}
