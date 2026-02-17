# JavaScript প্রশ্নোত্তর

এই ফাইলটিতে JavaScript সম্পর্কিত গুরুত্বপূর্ণ প্রশ্নগুলির উত্তর বাংলায় দেওয়া হয়েছে।

---

## ১) null এবং undefined এর মধ্যে পার্থক্য

### null
- **সংজ্ঞা**: null ইঙ্গিত করে যে কোনো মূল্য নেই।
- **প্রকার**: null একটি object হিসাবে বিবেচিত হয়।
- **ব্যবহার**: ডেভেলপার দ্বারা স্পষ্টভাবে একটি ভেরিয়েবলে null assign করা হয়।
- **উদাহরণ**:
```javascript
let x = null;
console.log(typeof x);
```

### undefined
- **সংজ্ঞা**: মানে একটি ভেরিয়েবল declare করা হয়েছে কিন্তু এর কোনো মূল্য assign করা হয়নি।
- **প্রকার**: undefined নিজেই একটি প্রকার।
- **ব্যবহার**: JavaScript স্বয়ংক্রিয়ভাবে undefined assign করে যখন কোনো মূল্য নির্দিষ্ট করা হয় না।
- **উদাহরণ**:
```javascript
let y;
console.log(y);
console.log(typeof y);
```

### মূল পার্থক্য
| বিষয় | null | undefined |
|------|------|-----------|
| অর্থ | intentional - মূল্য নেই | unintentional - মূল্য assign করা হয়নি |
| কে assign করে | ডেভেলপার | JavaScript |
| প্রকার | object | undefined |
| তুলনা | `null == undefined` → true | `null === undefined` → false |

---

## ২) JavaScript এ map() ফাংশনের ব্যবহার এবং forEach() এর সাথে পার্থক্য

### map() ফাংশন
- **ব্যবহার**: একটি array এর প্রতিটি element এর উপর একটি ফাংশন প্রয়োগ করে এবং একটি নতুন array রিটার্ন করে।
- **Return value**: নতুন array রিটার্ন করে।
- **পরিবর্তন**: Original array পরিবর্তন করে না।
- **উদাহরণ**:
```javascript
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8]
```

### forEach() ফাংশন
- **ব্যবহার**: একটি array এর প্রতিটি element এর উপর একটি ফাংশন প্রয়োগ করে কিন্তু কিছু রিটার্ন করে না।
- **Return value**: undefined রিটার্ন করে।
- **পরিবর্তন**: শুধুমাত্র side effects এর জন্য ব্যবহৃত হয়।
- **উদাহরণ**:
```javascript
const numbers = [1, 2, 3, 4];
numbers.forEach(num => console.log(num * 2));
// 2, 4, 6, 8 প্রিন্ট হয়
```

### মূল পার্থক্য
| বিষয় | map() | forEach() |
|------|-------|-----------|
| Return value | নতুন array | undefined |
| ব্যবহার | ডেটা transform করতে | শুধু iteration এর জন্য |
| Chainable | হ্যাঁ | না |
| Performance | foreach এর চেয়ে একটু slow | একটু দ্রুত |

---

## ৩) == এবং === এর মধ্যে পার্থক্য

### == (Loose Equality)
- **নাম**: Loose comparison বা Abstract equality।
- **কাজ**: দুটি মূল্য তুলনা করে type coercion করার পরে।
- **অর্থ**: মূল্য সমান কিনা তা চেক করে, প্রকার পরিবর্তন করে যদি প্রয়োজন।
- **উদাহরণ**:
```javascript
console.log(5 == "5");    // true (string কে number এ রূপান্তরিত করা হয়)
console.log(null == undefined); // true
console.log(0 == false);   // true
```

### === (Strict Equality)
- **নাম**: Strict comparison বা Identical equality।
- **কাজ**: দুটি মূল্য এবং তাদের প্রকার সঠিকভাবে তুলনা করে।
- **অর্থ**: মূল্য এবং প্রকার উভয়ই একই হতে হবে।
- **উদাহরণ**:
```javascript
console.log(5 === "5");    // false (বিভিন্ন প্রকার)
console.log(null === undefined); // false
console.log(0 === false);   // false
```

### সুপারিশ
- **সর্বদা ===  ব্যবহার করুন** কারণ এটি আরও predictable এবং আরও নিরাপদ।
- == ব্যবহার করলে অপ্রত্যাশিত ফলাফল হতে পারে।

---

## ৪) API ডেটা ফেচ করার সময় async/await এর গুরুত্ব

### async/await কী?
- **async**: একটি ফাংশন কে declare করে যা asynchronous কাজ করে এবং একটি Promise রিটার্ন করে।
- **await**: Promise resolve হওয়ার জন্য অপেক্ষা করে এবং তারপর result রিটার্ন করে।

### API ডেটা ফেচিং এ গুরুত্ব

1. **Cleaner Code**: Promise chaining এর পরিবর্তে synchronous এর মতো কোড লেখা যায়।

```javascript
// বিনা async/await (Promise chaining)
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

// async/await সহ
async function getData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

2. **Better Error Handling**: try/catch ব্যবহার করে সহজেই error handle করা যায়।

3. **Sequential Operations**: একাধিক API calls ক্রমানুসারে করা সহজ।

```javascript
async function getMultipleData() {
  const user = await fetch('/api/user');
  const posts = await fetch('/api/posts');
  const comments = await fetch('/api/comments');
  // সব data একসাথে পাওয়া যাবে
}
```

4. **Readability**: কোড পড়া এবং বোঝা আরও সহজ।

---

## ৫) JavaScript এ Scope এর ধারণা

### Scope কী?
Scope হল একটি স্থান যেখানে একটি ভেরিয়েবল access করা যায়।

### তিন ধরনের Scope

#### A. Global Scope (গ্লোবাল স্কোপ)
- **সংজ্ঞা**: যা কোনো function বা block এর বাইরে declare করা হয়।
- **অ্যাক্সেস**: সর্বত্র access করা যায়।
- **উদাহরণ**:
```javascript
const globalVar = "আমি global";

function test() {
  console.log(globalVar); // "আমি global"
}
```

#### B. Function Scope (ফাংশন স্কোপ)
- **সংজ্ঞা**: function এর মধ্যে declare করা ভেরিয়েবল শুধুমাত্র সেই function এ accessible।
- **অ্যাক্সেস**: function এর ভিতরে এবং nested functions এ।
- **মনে রাখুন**: `var` ফাংশন-স্কোপড, কিন্তু `let` এবং `const` block-scoped।
- **উদাহরণ**:
```javascript
function myFunction() {
  let functionVar = "আমি function scope";
  console.log(functionVar); // কাজ করে
}

console.log(functionVar); // ReferenceError - function scope এর বাইরে
```

#### C. Block Scope (ব্লক স্কোপ)
- **সংজ্ঞা**: `if`, `for`, `while` এর মতো blocks এর মধ্যে declare করা ভেরিয়েবল শুধুমাত্র সেই block এ accessible।
- **অ্যাক্সেস**: শুধুমাত্র block এর মধ্যে।
- **মনে রাখুন**: `let` এবং `const` block-scoped, কিন্তু `var` নয়।
- **উদাহরণ**:
```javascript
if (true) {
  let blockVar = "আমি block scope";
  console.log(blockVar); // কাজ করে
}

console.log(blockVar); // ReferenceError
```

### Scope Chain (স্কোপ চেইন)
- JavaScript inner scope থেকে outer scope এর ভিতর দিয়ে ভেরিয়েবল খোঁজে।
- যদি inner scope এ ভেরিয়েবল না থাকে, তাহলে outer scope এ খোঁজে।

```javascript
const outer = "outer";

function test() {
  const middle = "middle";
  
  function inner() {
    const innerVar = "inner";
    console.log(outer);     // "outer" - outer scope
    console.log(middle);    // "middle" - parent function scope
    console.log(innerVar);  // "inner" - own scope
  }
  
  inner(); // সব এ কাজ করে
}
```

### সুপারিশ
- এড়িয়ে চলুন global variables যতটা সম্ভব।
- `var` এর পরিবর্তে `let` এবং `const` ব্যবহার করুন।
- Block scope ব্যবহার করুন variable isolation এর জন্য।

---

**তৈরি করা হয়েছে**: SwiftCart Project  
**তারিখ**: ফেব্রুয়ারি ২০২৬
