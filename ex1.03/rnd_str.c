# include <stdio.h>
# include <stdlib.h>
# include <time.h>
# include <string.h>
# include <unistd.h>

# define STRING_SZ 36

void generateRndStr(char * str, size_t size) {
	const char charset[] = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	if (size) {
		--size;
		for (size_t n = 0; n < size; n++) {
			int key = rand() % (int)(sizeof(charset) -1);
			str[n] = charset[key];

		}
		str[size] = '\0';
	}
}


int main() {
	char rndStr[STRING_SZ +1];
	srand(time(NULL));

	while(1){
		generateRndStr(rndStr, sizeof(rndStr));
		time_t now = time(NULL);
		char *dt = ctime(&now);
		dt[strlen(dt) -1] = '\0';
		printf("%s: %s\n", dt, rndStr);
		sleep(5);
	}
	return 0;
}
