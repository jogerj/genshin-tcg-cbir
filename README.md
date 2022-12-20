# genshin-tcg-cbir

Implementation of Contend-Based Image Retrieval (CIBR) to extract data from Genshin Impact generated Genius Invokation TCG image

## Extracting deck data

1. To generate image, go to the deck, select the "..." menu -> "Preview Deck" -> "Share image". The image will be stored in your ScreenShots folder.
![Example Deck](samples/20221219214910.png)

2. Run the following:
   - Python 3:

     ```sh
     cd python
     python generate_json.py -q path/to/image.png -r ../images
     ```

   - Node.js

     ```text
     Soon™
     ```

## Indexing more cards

Should the game be updated with more cards, add them to the respective [directory](images) and rerun the following to reindex all cards:

```sh
cd python
python indexer.py --dataset ../images/characters --index characters_index.csv
python indexer.py --dataset ../images/actions --index actions_index.csv
```

## License

[MIT](LICENSE)

This project is not affiliated with HoYoVerse. Genshin Impact, game content and materials are trademarks and copyrights of HoYoVerse.
