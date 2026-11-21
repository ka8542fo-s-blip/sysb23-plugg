// Läs för Verksamhetsarkitektur sedan 2026-11-21 (Kaspers beslut: bara
// lärarens tre moduldokument): lärarens egen text ur modul-PDF:erna,
// ordagrant på engelska, en sida per modul. Lärandemål, kärnbudskap,
// förklarande text och listor — inga frågor (de finns i Öva) och inget vi
// har skrivit. Rubrikerna är lärarens. Den tidigare kapiteltexten
// (reading.js, cards.js) ligger kvar i repot men visas inte.
//
// Avskrivet ur kursmaterial-arkitektur/modul-1-4.pdf, modul-5-8.pdf och
// modul-9-12.pdf. Uppenbara PDF-rester är borttagna (punkttecken som blivit
// "o", en symbol efter "So, it starts"); stavningen är lärarens.

// Lärarens inledning i modul 1 ("12-Module Teaching System"), överst i Läs.
export const UF_INTRO =
  "I have created 12 modules of student study material split in three parts. Those will somewhat follow the three lectures as seen below. Since the course is very small in ECTS-points and there is a lot of material to consider, I propose that you perceive this course as a demanding one. The size of the course also helped me to decide to provide the answers to most questions. The idea is that you study all questions and try to learn the questions broadly, but also to understand the answer for those. In chapter 12 there is a presentation of what to understand and be able to explain yourself together with more deep case-questions. So, start by analyze what is said within lecture 3 Modul 3 (in chapter 12). Then start with lecture 1 modules 1-4 (as seen below) and so on.";

export const UF_TEXT = {
  kap12: `
This module is deliberately different. It asks students to integrate concepts from the previous eleven modules.

## The big picture

An architecture provides a way of understanding:

- what exists,
- why it exists,
- how things relate,
- what needs to change,
- what consequences change will have,
- and how change can be governed.

## The ten concepts’ students absolutely should know

Before attempting the questions, students should be able to explain these ten concepts without looking them up.

1. **Enterprise** — An enterprise is a collection of organizations, organizational units, or capabilities with a common set of goals.
2. **Architecture** — Architecture describes the fundamental organization of something, including its components, relationships, principles and constraints.
3. **Enterprise Architecture** — Enterprise Architecture addresses the structure and evolution of the enterprise in relation to its objectives.
4. **Business capability** — A capability describes what an organization can do.
5. **Value stream** — A value stream describes how value is created and delivered to a stakeholder.
6. **Architecture principle** — A principle provides enduring guidance for architectural decisions.
7. **Governance** — Governance establishes decision rights, accountability, direction and control.
8. **Zachman** — Zachman provides an ontology/classification schema for organizing descriptions of an enterprise.
9. **TOGAF** — TOGAF provides guidance and an approach for developing and governing Enterprise Architecture, including the ADM.
10. **Digital transformation** — Digital transformation involves using digital capabilities to fundamentally change how an enterprise operates and creates or delivers value.

## Purpose of the module

This final module brings together the major ideas from the entire Enterprise Architecture course.

The objective is not simply to remember definitions. Students should be able to connect concepts, distinguish related ideas, and apply Enterprise Architecture thinking to realistic situations.

By the end of this module, students should be able to:

- Explain the purpose of Enterprise Architecture.
- Distinguish Enterprise Architecture from IT architecture.
- Explain the role of Zachman and TOGAF and why they are different.
- Explain the relationship between strategy, capabilities, value streams, processes and solutions.
- Explain the role of architecture principles and governance.
- Explain how architecture can support Agile and digital transformation.
- Analyze an architectural problem from multiple perspectives.
- Make and justify architectural recommendations.
- Recognize common misconceptions about Enterprise Architecture.

## Zachman or TOGAF?

**Important qualification**

This does not mean that TOGAF cannot use classifications or that Zachman has no relevance to architecture practice. The point is the primary role of each.

## Common examination traps

Students should be particularly careful with statements containing words such as:

- always
- never
- only
- must
- automatically
- completely
- exclusively

In Enterprise Architecture, these are often clues that a statement is too absolute.

For example: "Digital transformation always requires cloud technology." False.

Or: "Enterprise Architecture is exclusively about IT." False.

Or: "Every architecture decision must be approved centrally." False.

Architecture is highly contextual.

## The "architect's test"

Before recommending a solution, students should learn to ask five questions:

1. **Why?** - What business objective or problem are we addressing?
2. **What?** - What capability, value, information or outcome is involved?
3. **Who?** - Who are the stakeholders and decision-makers?
4. **How?** - What architectural change could address the problem?
5. **What are the consequences?** - What are the costs, risks, dependencies, trade-offs and impacts?

This is a useful mental model for the examination and for real architecture work.

## Final examination checklist

Before the examination, students should be able to explain, without notes:

**Enterprise Architecture fundamentals**

- What is an enterprise?
- What is architecture?
- What is Enterprise Architecture?
- How does EA differ from IT architecture?
- Why are relationships important?
- What is abstraction?

**Business architecture**

- What is a capability?
- What is a process?
- What is a value stream?
- How do capabilities relate to strategy?
- Why are capabilities useful for transformation?

**Zachman**

- What is the Zachman Framework?
- Why is it better described as an ontology/classification schema?
- What are the six interrogatives?
- What do the perspectives represent?
- Why isn't Zachman a methodology?

**TOGAF**

- What is TOGAF?
- What is the ADM?
- Why is the ADM iterative?
- What are the architecture domains?
- What is architecture governance?
- What are architecture principles?

**Agility**

- What is Agile architecture?
- What does "just enough architecture" mean?
- What are architectural guardrails?
- How can governance support agility?

**Digital transformation**

- What is digitization?
- What is digitalization?
- What is digital transformation?
- Why is transformation more than technology?
- How does Enterprise Architecture support transformation?

**Architecture thinking**

- How do you analyze a problem before selecting a solution?
- How do you identify trade-offs?
- How do you connect strategy to implementation?
- How do you manage current, target and transition architectures?
- How do you communicate architecture to different stakeholders?

## Final message to the student

The purpose of this course is not to teach you to memorize a framework.

It is to teach you to look at an enterprise as a system, understand its purpose and structure, recognize relationships and dependencies, evaluate architectural trade-offs, and help the organization change deliberately.

Zachman gives you a way to think about the different descriptions of the enterprise.

TOGAF gives you guidance for developing and evolving architecture.

Business capabilities connect strategy with what the enterprise must be able to do. Governance provides the decision framework. Agile approaches help architecture evolve with change. Digital transformation challenges the enterprise to rethink how it creates and delivers value.
`,

  kap1: `
## Learning objectives

By the end of this module, students should be able to:

- Define an enterprise.
- Explain why an enterprise is more than an organization.
- Identify the boundaries and stakeholders of an enterprise.
- Explain why understanding the enterprise is fundamental to Enterprise Architecture.

## Core teaching message

An enterprise is any collection of organizations, organizational units, or capabilities that has a common set of goals.

It can therefore be:

- A corporation
- A government agency
- A university
- A municipality
- A group of collaborating organizations
- A supply-chain ecosystem

The key point is that the architect must understand the enterprise that is being architected, rather than automatically assuming that the enterprise is the legal organization.

## Lecturer explanation

"If Volvo, a Volvo dealership, a logistics provider and a bank collaborate to provide a customer with a car, which of them belongs to the enterprise we are trying to understand?"

There isn't necessarily one correct answer. It depends on the scope and purpose of the architecture.

Architecture scope is determined by the problem we are trying to solve.

This introduces an important principle for how all modules are structured:

First, I explain and somewhat motivate every module. Secondly, I have multiple choice questions, then true or false, then short essay questions followed by little deeper essay questions in each of every module. Sometimes I have explanations but mostly not to the multiple choice and true or false questions (it would be too much to read for you).
`,

  kap2: `
## Learning objectives

Students should understand:

- Architecture as structure and relationships.
- Architecture as abstraction.
- The difference between architecture, design and implementation.
- Why architecture exists.

## Core concept

Architecture is concerned with:

The fundamental organization of something, including its components, relationships, principles and evolution.

An architecture isn't merely a diagram. A diagram is a representation of an architecture.

## Core explanation

Architecture is not simply a collection of components. It concerns the fundamental organization of something, including its components, relationships, principles, constraints and evolution. A diagram is a representation of architecture, not architecture itself. Architecture is particularly concerned with relationships and consequences.

For example: Business capability → process → information → application → technology

allows the architect to ask:

"If this capability changes, what else is affected?" - The architecture is concerned with the relationships between these elements.

That is architectural thinking.
`,

  kap3: `
## Learning objectives

Students should be able to:

- Define Enterprise Architecture.
- Distinguish Enterprise Architecture from IT architecture.
- Explain its relationship to strategy.
- Explain why Enterprise Architecture enables change.

## Core definition

Enterprise Architecture is the practice of understanding, designing, communicating and governing the fundamental structure and evolution of an enterprise to achieve its objectives.

Important distinction: the key question is not: "What technology should we buy?"

It is: "What does the enterprise need to become capable of doing, and what changes are necessary to achieve its objectives?"

IT architecture asks: "How should our technology be structured?"

Enterprise Architecture asks: "How should the enterprise evolve so that it can achieve its objectives?", but as often the case - Technology may be part of the answer.
`,

  kap4: `
## Learning objectives

Students should understand:

- a. Zachman's purpose.
- b. The six interrogatives.
- c. The different perspectives.
- d. Why Zachman is an ontology/classification schema rather than a methodology.

The Zachman Framework is best understood as an ontology and classification schema for enterprise descriptions.

## The six questions

- **What?** — things/data
- **How?** — processes/functions
- **Where?** — locations
- **Who?** — people/responsibilities
- **When?** — time/events
- **Why?** — motivation/goals

## Key teaching point

Zachman doesn't say: "Do this, then this, then this." Instead: "Here are different dimensions and perspectives through which the enterprise can be described." - That is why it should not be confused with a methodology.
`,

  kap5: `
## Learning objectives

Students should understand:

- What TOGAF is.
- The purpose of the ADM.
- Why the ADM is iterative.
- How TOGAF differs from Zachman.
- Architecture development.
- The distinction between framework guidance and an organization's actual architecture.

## Core message

The TOGAF Standard provides a body of guidance and an approach for Enterprise Architecture. The Architecture Development Method (ADM) provides an iterative approach to developing and managing architecture.

A simplified view includes:

- Preliminary
- Architecture Vision
- Business Architecture
- Information Systems Architectures
- Technology Architecture
- Opportunities and Solutions
- Migration Planning
- Implementation Governance
- Architecture Change Management

The ADM should NOT be treated as a simplistic linear waterfall process.
`,

  kap6: `
## Learning objectives

Students should understand:

- Business Architecture
- Data Architecture
- Application Architecture
- Technology Architecture
- Views and viewpoints
- Stakeholder concerns

## Four familiar domains

- **Business** - Capabilities, processes, organization, value and business services.
- **Data** - Information, data structures, ownership, governance and flows.
- **Application** - Applications and application services.
- **Technology** - Infrastructure, platforms, networks and technology services.

## Important warning

These domains are not independent silos. The interesting architectural questions concern their relationships. These domains are interconnected. A stakeholder may need a particular view of the architecture. A viewpoint establishes how a view should address a particular stakeholder concern.
`,

  kap7: `
## Learning objectives

Students should understand:

- Business capabilities.
- Business processes.
- Value streams.
- Their relationship to strategy.
- Business architecture.
- Capability-based planning.

**Capability** - What the organization is capable of doing.

**Process** - How the organization performs activities.

**Value stream** - How value is created and delivered to a stakeholder.

## Example

Strategy: "Become the easiest bank for first-time home buyers."

Capability: Digital Mortgage Origination

Value stream: Discover → Apply → Verify → Approve → Complete

Processes implement parts of the value stream.

## Core explanation

A capability describes: What the organization is capable of doing.

A process describes: How work is performed.

A value stream describes: How value is created and delivered to a stakeholder.

Capabilities are particularly useful because they can remain relatively stable even when organizational structures and processes change.
`,

  kap8: `
## Learning objectives

Students should understand:

- Architecture principles.
- Governance.
- Decision rights.
- Guardrails.
- Trade-offs.

## Principle example - "Information is an enterprise asset."

This principle can influence:

- Data ownership
- Application design
- Integration
- Governance
- Security
- Investment

## Governance

Governance answers: Who has the authority to make which decisions, under what constraints?
`,

  kap9: `
## Learning objectives

Students should understand:

- Agile and architecture.
- Continuous architecture.
- Just-enough architecture.
- Guardrails.
- Architecture debt.
- Decentralized decision-making.

## Core explanation

Agile does not mean: "Architecture is unnecessary."

It means that architecture must accommodate:

- Iteration
- Feedback
- Changing priorities
- Incremental delivery
- Learning

Architecture should provide sufficient direction without attempting to predict every detail year in advance.
`,

  kap10: `
## Learning objectives

Students should be able to distinguish between:

- Digitization
- Digitalization
- Digital transformation
- Digital business models
- Digital ecosystems

## Core explanation

**Digitization** - Converting analog information into digital form.

**Digitalization** - Using digital technologies to improve existing activities and processes.

**Digital transformation** - Using digital capabilities to fundamentally change how an enterprise creates, delivers and captures value (services).

Technology alone does not constitute transformation.
`,

  kap11: `
## Case Study: Traditional Bank

A traditional bank has:

- Multiple customer databases.
- A 25-year-old core banking platform.
- Independent digital channels.
- Slow-release cycles.
- Many duplicated applications.
- Increasing competition from digital banks.

The CEO states: "We need to become a digital bank within two years."

## Student task

Analyze the situation from an Enterprise Architecture perspective.
`,
};
