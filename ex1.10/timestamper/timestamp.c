# include <stdio.h>
# include <time.h>
# include <unistd.h>

int main() {
	while(1){
		char *tempFilePath ="/usr/src/app/files/timestamp.txt.tmp";
		char *finalFilePath = "/usr/src/app/files/timestamp.txt";
		FILE *file = fopen(tempFilePath, "w");
		if (file == NULL) {
			perror("Error opening file");
			return 1;
		}
		time_t now = time(NULL);
		char *time_str = ctime(&now);

		fprintf(file,"%s", time_str);

		fclose(file);

		if (rename(tempFilePath,finalFilePath) != 0){
			perror("Error renaming temporary file.");
			return 1;
		}
		sleep(1);
	}
	return 0;
};
