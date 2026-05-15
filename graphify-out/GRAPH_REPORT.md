# Graph Report - play-learn-grow-kids  (2026-05-13)

## Corpus Check
- 141 files · ~239,283 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 379 nodes · 483 edges · 46 communities (34 shown, 12 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 34 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `958c5acb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 23|Community 23]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 45 edges
2. `useAuth()` - 34 edges
3. `Badge()` - 22 edges
4. `playSound()` - 16 edges
5. `useLang()` - 15 edges
6. `ActivityService` - 15 edges
7. `toast()` - 12 edges
8. `useToast()` - 12 edges
9. `mockDelay()` - 11 edges
10. `AudioService` - 10 edges

## Surprising Connections (you probably didn't know these)
- `fetchContent()` --calls--> `mockDelay()`  [INFERRED]
  src/pages/LessonDetail.tsx → src/data/staticData.ts
- `HeroSection()` --calls--> `useLang()`  [INFERRED]
  src/components/HeroSection.tsx → src/contexts/LangContext.tsx
- `LessonTracker()` --calls--> `useAuth()`  [INFERRED]
  src/components/LessonTracker.tsx → src/contexts/AuthContext.tsx
- `Toaster()` --calls--> `useTheme()`  [INFERRED]
  src/components/ui/sonner.tsx → src/contexts/ThemeContext.tsx
- `Auth()` --calls--> `useAuth()`  [INFERRED]
  src/pages/Auth.tsx → src/contexts/AuthContext.tsx

## Communities (46 total, 12 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (33): LessonTracker(), useLessonProgress(), checkAnswer(), generateNewRound(), generateOptions(), resetGame(), checkAnswer(), generateNewQuestion() (+25 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (8): AdminLayout(), handleStandardSelect(), handleSubjectsClick(), isActive(), HeroSection(), useLang(), useTheme(), Index()

### Community 3 - "Community 3"
Cohesion: 0.1
Nodes (19): handleDeleteGrade(), handleDeleteSubject(), handleGradeSubmit(), handleSubjectSubmit(), loadData(), resetGradeForm(), resetSubjectForm(), handleSubmit() (+11 more)

### Community 4 - "Community 4"
Cohesion: 0.09
Nodes (11): fetchChallenge(), handleComplete(), AuthProvider(), useAuth(), StudentActivityProvider(), useStudentActivity(), useRealTimeProgress(), Auth() (+3 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (7): fetchAssignments(), handleDelete(), handleSave(), fetchSchedule(), handleDelete(), handleSave(), Badge()

### Community 7 - "Community 7"
Cohesion: 0.17
Nodes (4): getLevel(), getLevelProgress(), ActivityService, getAuthUser()

### Community 9 - "Community 9"
Cohesion: 0.24
Nodes (5): fromDB(), fromLS(), loadProgress(), rate(), save()

## Knowledge Gaps
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Badge()` connect `Community 5` to `Community 2`, `Community 3`, `Community 4`, `Community 6`, `Community 7`, `Community 8`, `Community 15`?**
  _High betweenness centrality (0.358) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `Community 4` to `Community 0`, `Community 2`, `Community 3`, `Community 5`, `Community 6`, `Community 7`, `Community 9`, `Community 11`, `Community 15`?**
  _High betweenness centrality (0.339) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 1` to `Community 32`, `Community 5`, `Community 10`, `Community 16`, `Community 22`, `Community 31`?**
  _High betweenness centrality (0.235) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `useAuth()` (e.g. with `LessonTracker()` and `StudentActivityProvider()`) actually correct?**
  _`useAuth()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `playSound()` (e.g. with `checkAnswer()` and `checkAnswer()`) actually correct?**
  _`playSound()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `useLang()` (e.g. with `HeroSection()` and `Index()`) actually correct?**
  _`useLang()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._