#!/bin/bash
# 下载美食图片到本地

cd /Users/liuxiaocong/Workspace/github/personal/toolkits-what-lunch/public/foot

# 33个 unsplash 图片 ID
images=(
  "photo-1569718212165-3a8278d5f624"
  "photo-1525755662778-989d0524087e"
  "photo-1588166524941-3bf61a9c41db"
  "photo-1534422298391-e4f8c172dddb"
  "photo-1555939594-58d7cb561ad1"
  "photo-1518492104633-130d0cc84637"
  "photo-1565299624946-b28f40a0ae38"
  "photo-1568901346375-23c9450c58cd"
  "photo-1562967914-608f82629710"
  "photo-1579871494447-9811cf80d66c"
  "photo-1496116218417-1a781b1c416c"
  "photo-1565299507177-b0ac66763828"
  "photo-1612929633738-8fe44f7ec841"
  "photo-1584269600464-37b1b58a9fe1"
  "photo-1476718406336-bb5a9690ee2a"
  "photo-1512058564366-18510be2db19"
  "photo-1623689046286-d4ca3f6b2f52"
  "photo-1544025162-d76694265947"
  "photo-1529692236671-f1f6cf9683ba"
  "photo-1603133872878-684f208fb84b"
  "photo-1582452919408-53c12f8e0621"
  "photo-1600891964092-4316c288032e"
  "photo-1547592180-85f173990554"
  "photo-1546069901-ba9599a7e63c"
  "photo-1553163147-622ab57be1c7"
  "photo-1621996346565-e3dbc646d9a9"
  "photo-1546833999-b9f581a1996d"
  "photo-1528735602780-2552fd46c7af"
  "photo-1612392062631-94dd858cba88"
  "photo-1626700051175-6818013e1d4f"
  "photo-1517701550927-30cf4ba1dba5"
  "photo-1598103442097-8b74394b95c6"
)

# 为了避免冲突，我们用简单的编号命名
# 稍后需要在 foods.ts 中修改路径

for i in "${!images[@]}"; do
  id="${images[$i]}"
  filename="food_$i.jpeg"
  url="https://images.unsplash.com/${id}?w=800&q=80"
  
  if [ ! -f "$filename" ]; then
    echo "Downloading $filename..."
    curl -sL "$url" -o "$filename"
    sleep 0.3
  else
    echo "$filename already exists"
  fi
done

echo "Done!"
ls -la
