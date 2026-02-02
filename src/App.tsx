import { useState, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  VStack,
  HStack,
  Badge,
  Divider,
  useBreakpointValue,
} from "@chakra-ui/react";

// Base de données des flashs courants avec leur Guide Number (à ISO 100, zoom 35mm)
const FLASHES: Record<string, { gn: number; brand: string; type: string }> = {
  // Canon Speedlites
  "Canon 600EX II-RT": { gn: 60, brand: "Canon", type: "Cobra" },
  "Canon 580EX II": { gn: 58, brand: "Canon", type: "Cobra" },
  "Canon 430EX III-RT": { gn: 43, brand: "Canon", type: "Cobra" },
  "Canon EL-1": { gn: 60, brand: "Canon", type: "Cobra" },
  // Nikon Speedlights
  "Nikon SB-5000": { gn: 55, brand: "Nikon", type: "Cobra" },
  "Nikon SB-910": { gn: 48, brand: "Nikon", type: "Cobra" },
  "Nikon SB-700": { gn: 38, brand: "Nikon", type: "Cobra" },
  // Sony
  "Sony HVL-F60RM2": { gn: 60, brand: "Sony", type: "Cobra" },
  "Sony HVL-F46RM": { gn: 46, brand: "Sony", type: "Cobra" },
  // Godox
  "Godox V1": { gn: 76, brand: "Godox", type: "Cobra" },
  "Godox V860 III": { gn: 60, brand: "Godox", type: "Cobra" },
  "Godox TT685 II": { gn: 60, brand: "Godox", type: "Cobra" },
  "Godox AD200 Pro": { gn: 52, brand: "Godox", type: "Portable" },
  "Godox AD400 Pro": { gn: 72, brand: "Godox", type: "Studio portable" },
  "Godox AD600 Pro": { gn: 87, brand: "Godox", type: "Studio portable" },
  // Profoto
  "Profoto A1X": { gn: 46, brand: "Profoto", type: "Cobra" },
  "Profoto B10": { gn: 56, brand: "Profoto", type: "Studio portable" },
  // Flash intégré
  "Flash intégré (petit)": { gn: 10, brand: "Générique", type: "Intégré" },
  "Flash intégré (moyen)": { gn: 12, brand: "Générique", type: "Intégré" },
};

// Ouvertures courantes
const APERTURES = [1.4, 1.8, 2, 2.8, 4, 5.6, 8, 11, 16, 22];

// ISOs courants
const ISOS = [100, 200, 400, 800, 1600, 3200, 6400];

function App() {
  const [selectedFlash, setSelectedFlash] = useState<string>("");
  const [customGN, setCustomGN] = useState<number>(40);
  const [iso, setIso] = useState<number>(100);
  const [aperture, setAperture] = useState<number>(5.6);

  const isMobile = useBreakpointValue({ base: true, md: false });

  // GN effectif (flash sélectionné ou valeur custom)
  const guideNumber = selectedFlash ? FLASHES[selectedFlash].gn : customGN;

  // Calcul de la distance maximale
  // Formule: Distance = (GN × √(ISO/100)) / ouverture
  const maxDistance = useMemo(() => {
    const isoFactor = Math.sqrt(iso / 100);
    const effectiveGN = guideNumber * isoFactor;
    const distance = effectiveGN / aperture;
    return Math.round(distance * 10) / 10;
  }, [guideNumber, iso, aperture]);

  // GN effectif à l'ISO sélectionné
  const effectiveGN = useMemo(() => {
    const isoFactor = Math.sqrt(iso / 100);
    return Math.round(guideNumber * isoFactor);
  }, [guideNumber, iso]);

  // Calcul pour différentes ouvertures (tableau récapitulatif)
  const distancesByAperture = useMemo(() => {
    const isoFactor = Math.sqrt(iso / 100);
    const effectiveGN = guideNumber * isoFactor;
    return APERTURES.map((ap) => ({
      aperture: ap,
      distance: Math.round((effectiveGN / ap) * 10) / 10,
    }));
  }, [guideNumber, iso]);

  // Slider marks
  const gnMarks = isMobile ? [10, 40, 60, 90] : [10, 20, 40, 60, 76, 90];

  return (
    <Box maxW="900px" mx="auto" p={{ base: 3, md: 6 }}>
      <VStack spacing={{ base: 4, md: 6 }} align="stretch">
        {/* Titre */}
        <Box textAlign="center" pb={2}>
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="bold"
            color="#212E40"
          >
            Calculateur Guide Number Flash
          </Text>
          <Text fontSize="sm" color="gray.500">
            À quelle distance maximale votre flash peut-il éclairer ?
          </Text>
        </Box>

        {/* Sélection flash */}
        <Box>
          <Text fontWeight="medium" fontSize="sm" mb={2}>
            Choisir un flash
          </Text>
          <Select
            placeholder="-- Sélectionner un flash --"
            value={selectedFlash}
            onChange={(e) => setSelectedFlash(e.target.value)}
            borderColor="#212E40"
            _hover={{ borderColor: "#FB9936" }}
            _focus={{ borderColor: "#FB9936", boxShadow: "0 0 0 1px #FB9936" }}
          >
            {Object.entries(FLASHES)
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([name, data]) => (
                <option key={name} value={name}>
                  {name} (GN {data.gn})
                </option>
              ))}
          </Select>
        </Box>

        <HStack>
          <Divider />
          <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
            ou
          </Text>
          <Divider />
        </HStack>

        {/* Slider GN custom */}
        <Box>
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontWeight="medium" fontSize="sm">
              Entrer le Guide Number manuellement
            </Text>
            <Badge colorScheme="orange" fontSize="md" px={2}>
              GN {guideNumber}
            </Badge>
          </Flex>
          <Box px={2} pb={6}>
            <Slider
              aria-label="guide-number"
              value={customGN}
              onChange={(val) => {
                setCustomGN(val);
                setSelectedFlash("");
              }}
              min={5}
              max={90}
              step={1}
            >
              {gnMarks.map((mark) => (
                <SliderMark key={mark} value={mark} mt={2} ml={-2} fontSize="xs">
                  {mark}
                </SliderMark>
              ))}
              <SliderTrack bg="#EFF7FB">
                <SliderFilledTrack bg="#FB9936" />
              </SliderTrack>
              <SliderThumb borderColor="#212E40" boxSize={5} />
            </Slider>
          </Box>
        </Box>

        <Divider />

        {/* ISO */}
        <Box>
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontWeight="medium" fontSize="sm">
              Sensibilité ISO
            </Text>
            <Badge colorScheme="blue" fontSize="md" px={2}>
              ISO {iso}
            </Badge>
          </Flex>
          <Box px={2} pb={6}>
            <Slider
              aria-label="iso"
              value={ISOS.indexOf(iso)}
              onChange={(val) => setIso(ISOS[val])}
              min={0}
              max={ISOS.length - 1}
              step={1}
            >
              {ISOS.map((isoVal, idx) => (
                <SliderMark
                  key={isoVal}
                  value={idx}
                  mt={2}
                  ml={isoVal >= 1000 ? -3 : -2}
                  fontSize="xs"
                >
                  {isoVal}
                </SliderMark>
              ))}
              <SliderTrack bg="#EFF7FB">
                <SliderFilledTrack bg="#3182CE" />
              </SliderTrack>
              <SliderThumb borderColor="#212E40" boxSize={5} />
            </Slider>
          </Box>
        </Box>

        {/* Ouverture */}
        <Box>
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontWeight="medium" fontSize="sm">
              Ouverture (f/)
            </Text>
            <Badge colorScheme="green" fontSize="md" px={2}>
              f/{aperture}
            </Badge>
          </Flex>
          <Box px={2} pb={6}>
            <Slider
              aria-label="aperture"
              value={APERTURES.indexOf(aperture)}
              onChange={(val) => setAperture(APERTURES[val])}
              min={0}
              max={APERTURES.length - 1}
              step={1}
            >
              {APERTURES.filter((_, idx) => !isMobile || idx % 2 === 0).map(
                (ap) => (
                  <SliderMark
                    key={ap}
                    value={APERTURES.indexOf(ap)}
                    mt={2}
                    ml={-2}
                    fontSize="xs"
                  >
                    {ap}
                  </SliderMark>
                )
              )}
              <SliderTrack bg="#EFF7FB">
                <SliderFilledTrack bg="#38A169" />
              </SliderTrack>
              <SliderThumb borderColor="#212E40" boxSize={5} />
            </Slider>
          </Box>
        </Box>

        {/* Résultat principal */}
        <Box bg="#EFF7FB" p={4} borderRadius="md">
          <VStack spacing={2}>
            <Text fontWeight="medium" color="#212E40">
              Distance maximale d'éclairage
            </Text>
            <Text fontSize="4xl" fontWeight="bold" color="#FB9936">
              {maxDistance} m
            </Text>
            <Text fontSize="sm" color="gray.500">
              GN effectif à ISO {iso} : {effectiveGN}
            </Text>
          </VStack>
        </Box>

        {/* Visualisation de la distance */}
        <Box>
          <Text fontWeight="medium" fontSize="sm" mb={3}>
            Visualisation
          </Text>
          <Box
            position="relative"
            h="80px"
            bg="gray.800"
            borderRadius="md"
            overflow="hidden"
          >
            {/* Gradient représentant la lumière du flash */}
            <Box
              position="absolute"
              left="10px"
              top="50%"
              transform="translateY(-50%)"
              w={`${Math.min((maxDistance / 20) * 100, 95)}%`}
              h="60px"
              bgGradient="linear(to-r, yellow.300, orange.400, transparent)"
              borderRadius="0 50% 50% 0"
              opacity={0.8}
            />
            {/* Icône flash */}
            <Box
              position="absolute"
              left="5px"
              top="50%"
              transform="translateY(-50%)"
              fontSize="2xl"
            >
              ⚡
            </Box>
            {/* Marqueur de distance */}
            <Box
              position="absolute"
              left={`${Math.min((maxDistance / 20) * 100, 95)}%`}
              top="50%"
              transform="translate(-50%, -50%)"
              bg="white"
              px={2}
              py={1}
              borderRadius="md"
              fontSize="sm"
              fontWeight="bold"
            >
              {maxDistance}m
            </Box>
            {/* Sujet */}
            {maxDistance <= 20 && (
              <Box
                position="absolute"
                left={`${(maxDistance / 20) * 100}%`}
                bottom="5px"
                transform="translateX(-50%)"
                fontSize="xl"
              >
                🧍
              </Box>
            )}
          </Box>
          <Flex justify="space-between" mt={1} fontSize="xs" color="gray.500">
            <Text>0m</Text>
            <Text>5m</Text>
            <Text>10m</Text>
            <Text>15m</Text>
            <Text>20m</Text>
          </Flex>
        </Box>

        {/* Tableau récapitulatif */}
        <Box>
          <Text fontWeight="medium" fontSize="sm" mb={3}>
            Distances par ouverture (ISO {iso})
          </Text>
          <Flex flexWrap="wrap" gap={2}>
            {distancesByAperture.map(({ aperture: ap, distance }) => (
              <Box
                key={ap}
                p={2}
                borderWidth={1}
                borderColor={ap === aperture ? "#FB9936" : "gray.200"}
                borderRadius="md"
                bg={ap === aperture ? "#FFF5EB" : "white"}
                minW="70px"
                textAlign="center"
              >
                <Text fontSize="xs" color="gray.500">
                  f/{ap}
                </Text>
                <Text fontWeight="bold" color="#212E40">
                  {distance}m
                </Text>
              </Box>
            ))}
          </Flex>
        </Box>

        {/* Info pédagogique */}
        <Box bg="gray.50" p={4} borderRadius="md" fontSize="sm" color="gray.600">
          <Text fontWeight="medium" mb={2}>
            Comprendre le Guide Number
          </Text>
          <Text mb={2}>
            Le <strong>Guide Number (GN)</strong> indique la puissance d'un flash.
            Plus il est élevé, plus le flash est puissant.
          </Text>
          <Text mb={2}>
            <strong>Formule :</strong> Distance max = GN × √(ISO÷100) ÷ ouverture
          </Text>
          <Text>
            <strong>Astuces :</strong> Doubler l'ISO équivaut à augmenter le GN de
            40%. Ouvrir d'un stop (ex: f/8 → f/5.6) double presque la distance.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}

export default App;
