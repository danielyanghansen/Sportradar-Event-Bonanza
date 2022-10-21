package com.sportradar.sdk.example;

import com.sportradar.sdk.common.exceptions.SdkException;
import com.sportradar.sdk.feed.common.entities.EventIdentifier;
import com.sportradar.sdk.feed.livescout.interfaces.LiveScoutFeed;
import com.sportradar.sdk.feed.livescout.interfaces.LiveScoutFeedListener;
import com.sportradar.sdk.feed.sdk.Sdk;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Main {

    private final static Logger logger = LoggerFactory.getLogger(Main.class);

    /**
     * The main entry point for the sdk-example
     *
     * @param args provided command line arguments
     */
    public static void main(String[] args) throws SdkException {
        logger.info("Current JVM version - " + System.getProperty("java.version"));

        final Sdk sdk = Sdk.getInstance();
        final LiveScoutFeed liveScoutFeed = sdk.getLiveScout();

        final LiveScoutFeedListener scoutFeedListener = new LiveScoutFeedListenerImpl();

        if (liveScoutFeed != null) {
            liveScoutFeed.open(scoutFeedListener);
        }

        logger.info("The sdk is running. Hit any key to exit");

        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        try {
            boolean close = false;
            while(!close && liveScoutFeed != null) {
                String input = reader.readLine();
                if("close".equals(input)) {
                    close = true;
                } else if("matchlist".equals(input)) {
                    logger.info("Sending matchlist request");

                    Duration duration = Duration.between(Instant.parse("2022-05-01T00:00:00.00Z"),
                        Instant.now());
                    /**
                     * matchlist request
                     * you can request the list of matches in a given window.
                     * you can filter with sport ids and matchids
                     *
                     * +-------+----------+
                     * |sportid|SPORTNAME |
                     * +-------+----------+
                     * |1      |Soccer    |
                     * |2      |Basketball|
                     * |3      |Baseball  |
                     * |4      |Ice Hockey|
                     * |5      |Tennis    |
                     * +-------+----------+
                     */

                    liveScoutFeed.getMatchList((int) duration.toHours(),
                        -1 * ((int) duration.toHours() - 72),
                        true, List.of(1L), null);

                } else if ("replay".equals(input)) {
                    /**
                     * you can replay a match with specific delay and start message
                     * in the following example:
                     * every 100ms you will receive the next event of the match
                     * it will start from the first event.
                     */
                    liveScoutFeed.subscribeToTest(EventIdentifier.id(35848015L), 100, 0);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        logger.info("Closing the sdk");
        sdk.close();
        logger.info("Sdk successfully closed. Main thread will now exit");
    }
}