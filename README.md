# Proposal: Knowledge-Oriented Service Jobs


**By**:
* Lan Xiao, lanxiao@design.upenn.edu

## Abstract

The job market in the post-COVID era is becoming more volatile and rapidly changing than ever before. This web dashboard will help graduates get quick information on the overall job market and common knowledge-oriented service positions to assist in better locating themselves to the industry, position and location.

The hiring window is usually in weekly resolution, but the Current Employment Statistics (CES) data is updated monthly. So this dashboard will focus on the month-over-month change in federal statistics metrics, as well as the week-over-week change in LinkedIn data. In particular:

CES:
- Employees, by selected industry 
- Average weekly hours and overtime,  by selected industry 
- Average weekly and hourly earnings,  by selected industry 

LinkedIn Job Post
- Number of Results When searching job posted past week, by position
- Compostion of experience levels, by position, by selected State
- Compostion of job titles, by position, by selected State
- Compostion of industries, by position, by selected State
- Compostion of remote availability, by position, by selected State

## Goal

* Help users understand employment market in various industries, jobs, and states.

## Stakeholders

* Employees seeking or relocating in common knowledge-oriented service positions.
* Especially target at graduates who are unfamiliar with the employment market.

## Decisions

* Which industry to join
* Which position to devote
* Which state to start career

## Data sources

- **Current Employment Statistics** -- [Federal Data by Industry](https://www.bls.gov/ces/) and [State and Metro Area Employment, Hours, & Earnings](https://www.bls.gov/sae/), are updated monthly by U.S. BUREAU OF LABOR STATISTICS, the BLS [Public Data API](https://www.bls.gov/developers/home.htm) is available
- **LinkedIn Job Post** -- [Python linkedin_api](https://github.com/tomquirk/linkedin-api), manual list of positions and states of interest are needed to excuse 	API repeatly, and manually weekly updates are needed.


