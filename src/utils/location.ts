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
 * 构建地图搜索 URL
 */
export function buildMapUrl(
  platform: MapPlatform,
  keyword: string,
  location?: Location,
): string {
  const encodedKeyword = encodeURIComponent(keyword);

  switch (platform) {
    case "dianping":
      // 大众点评
      if (location) {
        return `https://m.dianping.com/shoplist/1/search?from=m_search&keyword=${encodedKeyword}`;
      }
      return `https://www.dianping.com/search/keyword/203/0_${encodedKeyword}`;

    case "baidu":
      // 百度地图
      if (location) {
        return `https://map.baidu.com/search/${encodedKeyword}/@${location.longitude},${location.latitude},15z`;
      }
      return `https://map.baidu.com/search/${encodedKeyword}/`;

    case "amap":
      // 高德地图
      if (location) {
        return `https://restapi.amap.com/v3/place/search?keywords=${encodedKeyword}&location=${location.longitude},${location.latitude}&radius=3000`;
      }
      return `https://www.amap.com/search?query=${encodedKeyword}`;

    case "tencent":
      // 腾讯地图
      if (location) {
        return `https://apis.map.qq.com/jsapi?qt=nearby&lon=${location.longitude}&lat=${location.latitude}&keywords=${encodedKeyword}&reference=wd&height=100`;
      }
      return `https://map.qq.com/search/${encodedKeyword}`;

    default:
      return "";
  }
}

/**
 * 获取地图 App 的 scheme（用于打开原生 App）
 * 注意：这些 scheme 可能因版本而异，部分 App 可能不支持
 */
export function getMapAppScheme(
  platform: MapPlatform,
  keyword: string,
): string | null {
  const encodedKeyword = encodeURIComponent(keyword);

  const schemes: Record<MapPlatform, string | null> = {
    dianping: null, // 大众点评网页版更可靠
    baidu: `baidumap://map/place/search?query=${encodedKeyword}&src=openapi`,
    amap: `androidamap://openFeature?featureName=Search&query=${encodedKeyword}`,
    tencent: null, // 腾讯地图 scheme 不够稳定
  };

  return schemes[platform];
}
