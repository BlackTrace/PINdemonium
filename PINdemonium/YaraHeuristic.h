#pragma once
#include "Heuristics.h"
#include "ReportYaraRules.h"
namespace W{
#include "windows.h"
}

//size of the buffer used for communitating with the yara process
#define PIPE_BUFSIZE 4096

class YaraHeuristic
{
public:
	UINT32 run();
private:
	
	W::HANDLE g_hChildStd_OUT_Rd;
	W::HANDLE g_hChildStd_OUT_Wr;
	string ReadFromPipe(W::PROCESS_INFORMATION piProcInfo);
	BOOL existFile (std::string name);
	BOOL launchYara(string yara_path, string yara_rules_path, string yara_input_path,string yara_output,W::PROCESS_INFORMATION * piResults);
	UINT32 getFileSize(FILE * fp);
	vector<string> parseYaraOutput(string output);
	vector<string> split(const string &s, char delim);
};
